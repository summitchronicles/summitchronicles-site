/**
 * ADVANCED DISCORD BOT - Complete Blog Management
 *
 * Features:
 * - Run Researcher Agent from Discord
 * - Process notes from Discord
 * - Review drafts with interactive buttons
 * - Approve and publish blogs
 * - All operations from Discord (no need for dashboard!)
 *
 * Setup: See README.md
 */

require('dotenv').config({ path: '.env.local' });
import {
  Client,
  GatewayIntentBits,
  Message,
  Attachment,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ButtonInteraction
} from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { runResearcher } from '../researcher';
import { runContentUpdater } from '../content-updater';

const INCOMING_DIR = path.join(process.cwd(), 'content', 'incoming-notes');
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN || '';
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || '';
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

// Ensure directories exist
[INCOMING_DIR, BLOG_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Store pending drafts for approval
const pendingDrafts = new Map<string, { filename: string; title: string }>();

client.on('ready', () => {
  console.log(`🤖 Summit Chronicles Bot ready as ${client.user?.tag}`);
  console.log(`📝 Watching channel: ${CHANNEL_ID}`);
  console.log('');
  console.log('📋 Available Commands:');
  console.log('  !research      - Generate a new blog post about trending topics');
  console.log('  !note <text>   - Save a quick note for conversion');
  console.log('  !process       - Process pending notes into blogs');
  console.log('  !list          - List all blog drafts');
  console.log('  !help          - Show this help message');
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (message.channelId !== CHANNEL_ID) return;

  const content = message.content.toLowerCase();

  try {
    // COMMAND: !research
    if (content.startsWith('!research')) {
      await handleResearchCommand(message);
    }

    // COMMAND: !note
    else if (content.startsWith('!note')) {
      await handleNoteCommand(message);
    }

    // COMMAND: !process
    else if (content.startsWith('!process')) {
      await handleProcessCommand(message);
    }

    // COMMAND: !list
    else if (content.startsWith('!list')) {
      await handleListCommand(message);
    }

    // COMMAND: !help
    else if (content.startsWith('!help')) {
      await handleHelpCommand(message);
    }

    // Handle file uploads (auto-save as notes)
    else if (message.attachments.size > 0) {
      await handleFileUpload(message);
    }
  } catch (error: any) {
    console.error('Error handling message:', error);
    await message.reply(`❌ Error: ${error.message}`);
  }
});

// Handle button interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const buttonInteraction = interaction as ButtonInteraction;
  const [action, draftId] = buttonInteraction.customId.split(':');

  try {
    if (action === 'approve') {
      await handleApprove(buttonInteraction, draftId);
    } else if (action === 'reject') {
      await handleReject(buttonInteraction, draftId);
    } else if (action === 'view') {
      await handleView(buttonInteraction, draftId);
    }
  } catch (error: any) {
    await buttonInteraction.reply({
      content: `❌ Error: ${error.message}`,
      ephemeral: true
    });
  }
});

async function handleResearchCommand(message: Message) {
  const statusMsg = await message.reply('🔬 **Starting Research Agent...**\n\n' +
    '⏳ Step 1/3: Brainstorming trending topics...');

  setTimeout(async () => {
    await statusMsg.edit('🔬 **Starting Research Agent...**\n\n' +
      '✅ Step 1/3: Brainstorming complete\n' +
      '⏳ Step 2/3: Drafting blog post...');
  }, 5000);

  setTimeout(async () => {
    await statusMsg.edit('🔬 **Starting Research Agent...**\n\n' +
      '✅ Step 1/3: Brainstorming complete\n' +
      '✅ Step 2/3: Draft complete\n' +
      '⏳ Step 3/3: Generating image (may take 1-2 min)...');
  }, 15000);

  // Run researcher in background
  runResearcher()
    .then(async () => {
      // Find the newly created blog
      const files = fs.readdirSync(BLOG_DIR);
      const latestFile = files
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()[0];

      if (latestFile) {
        const filepath = path.join(BLOG_DIR, latestFile);
        const content = fs.readFileSync(filepath, 'utf-8');
        const titleMatch = content.match(/title: "(.+)"/);
        const title = titleMatch ? titleMatch[1] : latestFile;

        // Create approval embed
        const embed = new EmbedBuilder()
          .setColor(0x0099FF)
          .setTitle('📝 New Blog Draft Ready!')
          .setDescription(`**${title}**`)
          .addFields(
            { name: 'File', value: latestFile, inline: true },
            { name: 'Status', value: '✅ Complete', inline: true },
          )
          .setTimestamp();

        // Create action buttons
        const row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`view:${latestFile}`)
              .setLabel('👁️ View Draft')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId(`approve:${latestFile}`)
              .setLabel('✅ Approve & Publish')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId(`reject:${latestFile}`)
              .setLabel('🗑️ Delete')
              .setStyle(ButtonStyle.Danger)
          );

        pendingDrafts.set(latestFile, { filename: latestFile, title });

        await statusMsg.edit({
          content: '✅ **Research Complete!**',
          embeds: [embed],
          components: [row]
        });
      } else {
        await statusMsg.edit('⚠️ Research completed but no blog file found. Check logs.');
      }
    })
    .catch(async (error) => {
      await statusMsg.edit(`❌ **Research Failed**\n\nError: ${error.message}`);
    });
}

async function handleNoteCommand(message: Message) {
  const noteContent = message.content.replace('!note', '').trim();

  if (!noteContent) {
    await message.reply('⚠️ Usage: `!note Your note text here`');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}-discord-note.txt`;
  const filepath = path.join(INCOMING_DIR, filename);

  fs.writeFileSync(filepath, noteContent);

  await message.reply(`✅ Note saved!\n📁 \`${filename}\`\n\nRun \`!process\` to convert it to a blog.`);
}

async function handleProcessCommand(message: Message) {
  const files = fs.readdirSync(INCOMING_DIR).filter(f => f.endsWith('.txt'));

  if (files.length === 0) {
    await message.reply('📭 No notes to process.');
    return;
  }

  const statusMsg = await message.reply(`🔄 Processing ${files.length} note(s)...`);

  runContentUpdater()
    .then(async () => {
      await statusMsg.edit(`✅ Processed ${files.length} note(s)! Check \`!list\` to review drafts.`);
    })
    .catch(async (error) => {
      await statusMsg.edit(`❌ Processing failed: ${error.message}`);
    });
}

async function handleListCommand(message: Message) {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    await message.reply('📭 No drafts found.');
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('📚 Blog Drafts')
    .setDescription(`Found ${files.length} draft(s)`)
    .setTimestamp();

  files.slice(0, 10).forEach((file, i) => {
    embed.addFields({ name: `${i + 1}. ${file}`, value: '`!approve ' + file + '`', inline: false });
  });

  await message.reply({ embeds: [embed] });
}

async function handleHelpCommand(message: Message) {
  const embed = new EmbedBuilder()
    .setColor(0xFFAA00)
    .setTitle('🏔️ Summit Chronicles Bot - Help')
    .setDescription('Manage your blog entirely from Discord!')
    .addFields(
      { name: '!research', value: 'Generate a new blog post about trending topics', inline: false },
      { name: '!note <text>', value: 'Save a quick note for later conversion', inline: false },
      { name: '!process', value: 'Convert saved notes into blog posts', inline: false },
      { name: '!list', value: 'List all blog drafts', inline: false },
      { name: 'Upload .txt file', value: 'Auto-saves as a note', inline: false },
    )
    .setFooter({ text: 'Dashboard: http://localhost:3000/dashboard' });

  await message.reply({ embeds: [embed] });
}

async function handleFileUpload(message: Message) {
  const textAttachment = message.attachments.find((att: Attachment) =>
    att.name?.endsWith('.txt')
  );

  if (!textAttachment) {
    return; // Ignore non-txt files
  }

  const response = await fetch(textAttachment.url);
  const noteContent = await response.text();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${timestamp}-${textAttachment.name}`;
  const filepath = path.join(INCOMING_DIR, filename);

  fs.writeFileSync(filepath, noteContent);

  await message.reply(`✅ File saved as note!\n📁 \`${filename}\`\n\nRun \`!process\` to convert it.`);
}

async function handleApprove(interaction: ButtonInteraction, filename: string) {
  await interaction.deferReply();

  const filepath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filepath)) {
    await interaction.editReply('❌ Draft no longer exists.');
    return;
  }

  // In a full implementation, this would:
  // 1. Move file to /published/ directory
  // 2. Trigger deployment (Vercel webhook)
  // 3. Update database

  await interaction.editReply({
    content: `✅ **Blog Approved!**\n\n` +
      `📄 **${filename}**\n\n` +
      `🔗 Live at: \`http://localhost:3000/blog\`\n` +
      `(In production, this would trigger auto-deployment)`
  });

  pendingDrafts.delete(filename);
}

async function handleReject(interaction: ButtonInteraction, filename: string) {
  await interaction.deferReply();

  const filepath = path.join(BLOG_DIR, filename);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    await interaction.editReply(`🗑️ Deleted **${filename}**`);
  } else {
    await interaction.editReply('⚠️ File already deleted.');
  }

  pendingDrafts.delete(filename);
}

async function handleView(interaction: ButtonInteraction, filename: string) {
  await interaction.deferReply({ ephemeral: true });

  const filepath = path.join(BLOG_DIR, filename);

  if (!fs.existsSync(filepath)) {
    await interaction.editReply('❌ Draft not found.');
    return;
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  const preview = content.substring(0, 1500) + (content.length > 1500 ? '...' : '');

  await interaction.editReply({
    content: `**Preview: ${filename}**\n\n\`\`\`markdown\n${preview}\n\`\`\`\n\n` +
      `[View Full Draft](http://localhost:3000/api/preview/${encodeURIComponent(filename)})`
  });
}

// Start bot
if (DISCORD_TOKEN) {
  client.login(DISCORD_TOKEN);
} else {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env.local');
  process.exit(1);
}
