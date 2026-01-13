import * as fs from 'fs';
import * as path from 'path';

const USAGE_FILE = path.join(process.cwd(), '.agent_usage.json');

interface DailyUsage {
  date: string;
  agents: { [key: string]: number };
}

const LIMITS: { [key: string]: number } = {
  researcher: 20, // Max 20 external searches per day
  newsletter: 1, // Max 1 newsletter run per day (prevent spam)
  optimizer: 10, // Max 10 runs
  'content-updater': 50, // Higher limit for local tasks
  'knowledge-keeper': 50,
};

export class Guardrails {
  static loadUsage(): DailyUsage {
    const today = new Date().toISOString().split('T')[0];
    let usage: DailyUsage = { date: today, agents: {} };

    if (fs.existsSync(USAGE_FILE)) {
      try {
        const raw = JSON.parse(fs.readFileSync(USAGE_FILE, 'utf-8'));
        if (raw.date === today) {
          usage = raw;
        } else {
          console.log('🔄 New day detected. Resetting usage limits.');
        }
      } catch (e) {
        // Corrupt file, reset
      }
    }
    return usage;
  }

  static saveUsage(usage: DailyUsage) {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  }

  static async checkWait(agentName: string): Promise<boolean> {
    const usage = this.loadUsage();
    const current = usage.agents[agentName] || 0;
    const limit = LIMITS[agentName] || 10;

    if (current >= limit) {
      console.warn(
        `🛑 LIMIT REACHED: Agent "${agentName}" has used ${current}/${limit} runs today.`
      );
      return false;
    }

    // Increment
    usage.agents[agentName] = current + 1;
    this.saveUsage(usage);
    console.log(
      `🛡️ Guardrail: Agent "${agentName}" approved (${usage.agents[agentName]}/${limit}).`
    );
    return true;
  }
}
