'use client';

import {
  EditorRoot,
  EditorContent,
  StarterKit,
  HighlightExtension,
  TiptapUnderline,
  TiptapLink,
  TiptapImage,
  UpdatedImage,
  Color,
  TextStyle,
  Youtube,
  CodeBlockLowlight,
  TaskList,
  TaskItem,
  Placeholder,
  HorizontalRule,
  UploadImagesPlugin,
  createImageUpload,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandItem,
  EditorCommandList,
  EditorCommandEmpty,
  type JSONContent,
} from 'novel';
import { useState, useEffect } from 'react';

interface NovelEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function NovelEditor({
  content,
  onChange,
  placeholder = "Press '/' for commands, or start writing your story...",
  className = '',
}: NovelEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    // For now, create a local URL - in production you'd upload to cloud storage
    const url = URL.createObjectURL(file);
    return url;
  };

  const extensions = [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    HighlightExtension,
    TiptapUnderline,
    TextStyle,
    Color,
    TiptapLink.configure({
      HTMLAttributes: {
        class: 'text-summitGold hover:underline',
      },
    }),
    UpdatedImage.configure({
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto',
      },
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'not-prose pl-2',
      },
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: 'flex items-start my-4',
      },
      nested: true,
    }),
    Youtube.configure({
      HTMLAttributes: {
        class: 'rounded-lg',
      },
    }),
    CodeBlockLowlight,
    HorizontalRule.configure({
      HTMLAttributes: {
        class: 'border-white/20',
      },
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return "What's the title?";
        }
        return placeholder;
      },
    }),
    UploadImagesPlugin({
      imageClass: 'rounded-lg max-w-full h-auto',
    }),
  ];

  if (!mounted) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[500px] flex items-center justify-center">
        <div className="text-white/60">Loading advanced editor...</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <EditorRoot>
          <EditorContent
            className="novel-editor-dark"
            initialContent={content}
            onUpdate={({ editor }) => {
              const html = editor.getHTML();
              onChange(html || '');
            }}
            extensions={extensions}
            editorProps={{
              attributes: {
                class:
                  'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
                'data-placeholder': placeholder,
              },
              handleDOMEvents: {
                keydown: (_view, event) => {
                  // Handle keyboard shortcuts
                  if (event.key === 'Enter' && event.metaKey) {
                    return true;
                  }
                  return false;
                },
              },
            }}
            slotAfter={
              <div className="border-t border-white/10 p-3 bg-white/5">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <div className="flex gap-4">
                    <span>💡 Press &quot;/&quot; for commands</span>
                    <span>🖼️ Drag & drop images</span>
                    <span>⌘K for links</span>
                  </div>
                  <div>Rich text editor with full formatting</div>
                </div>
              </div>
            }
            immediatelyRender={false}
          />

          {/* Floating Toolbar */}
          <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl shadow-xl">
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleBold().run();
              }}
              className="p-2 text-white hover:bg-white/10 hover:text-summitGold"
            >
              <strong>B</strong>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleItalic().run();
              }}
              className="p-2 text-white hover:bg-white/10 hover:text-summitGold"
            >
              <em>I</em>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleUnderline().run();
              }}
              className="p-2 text-white hover:bg-white/10 hover:text-summitGold"
            >
              <u>U</u>
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleHighlight().run();
              }}
              className="p-2 text-white hover:bg-white/10 hover:text-summitGold"
            >
              🖍️
            </EditorBubbleItem>
          </EditorBubble>

          {/* Slash Commands */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-lg border border-white/20 bg-black/90 backdrop-blur-xl px-1 py-2 shadow-xl animate-in fade-in slide-in-from-bottom-1">
            <EditorCommandEmpty className="px-2 text-white/60">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              <EditorCommandItem
                value="heading1"
                onCommand={(editor) =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 text-white">
                  H1
                </div>
                <div>
                  <p className="font-medium">Heading 1</p>
                  <p className="text-xs text-white/60">Big section heading</p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="heading2"
                onCommand={(editor) =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
                  H2
                </div>
                <div>
                  <p className="font-medium">Heading 2</p>
                  <p className="text-xs text-white/60">
                    Medium section heading
                  </p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="heading3"
                onCommand={(editor) =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500 text-white">
                  H3
                </div>
                <div>
                  <p className="font-medium">Heading 3</p>
                  <p className="text-xs text-white/60">Small section heading</p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="bulletList"
                onCommand={(editor) =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                  •
                </div>
                <div>
                  <p className="font-medium">Bullet List</p>
                  <p className="text-xs text-white/60">
                    Create a simple bullet list
                  </p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="numberedList"
                onCommand={(editor) =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500 text-white">
                  1.
                </div>
                <div>
                  <p className="font-medium">Numbered List</p>
                  <p className="text-xs text-white/60">
                    Create a numbered list
                  </p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="taskList"
                onCommand={(editor) =>
                  editor.chain().focus().toggleTaskList().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500 text-white">
                  ☑
                </div>
                <div>
                  <p className="font-medium">Task List</p>
                  <p className="text-xs text-white/60">
                    Create a task list with checkboxes
                  </p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="blockquote"
                onCommand={(editor) =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-500 text-white">
                  &quot;&quot;
                </div>
                <div>
                  <p className="font-medium">Quote</p>
                  <p className="text-xs text-white/60">Capture a quote</p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="codeBlock"
                onCommand={(editor) =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500 text-white">
                  &lt;/&gt;
                </div>
                <div>
                  <p className="font-medium">Code Block</p>
                  <p className="text-xs text-white/60">Insert a code block</p>
                </div>
              </EditorCommandItem>
              <EditorCommandItem
                value="horizontalRule"
                onCommand={(editor) =>
                  editor.chain().focus().setHorizontalRule().run()
                }
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1 text-left text-sm text-white hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-white">
                  ―
                </div>
                <div>
                  <p className="font-medium">Divider</p>
                  <p className="text-xs text-white/60">
                    Add a horizontal divider
                  </p>
                </div>
              </EditorCommandItem>
            </EditorCommandList>
          </EditorCommand>
        </EditorRoot>
      </div>

      <style jsx global>{`
        /* Novel Editor Dark Theme Customization */
        .novel-editor-dark {
          background: transparent !important;
          color: white !important;
        }

        .novel-editor-dark .ProseMirror {
          background: transparent !important;
          color: white !important;
          border: none !important;
          outline: none !important;
        }

        .novel-editor-dark .ProseMirror p.is-editor-empty:first-child::before {
          color: rgba(255, 255, 255, 0.4) !important;
          content: attr(data-placeholder) !important;
          float: left !important;
          height: 0 !important;
          pointer-events: none !important;
        }

        /* Headings */
        .novel-editor-dark .ProseMirror h1,
        .novel-editor-dark .ProseMirror h2,
        .novel-editor-dark .ProseMirror h3,
        .novel-editor-dark .ProseMirror h4,
        .novel-editor-dark .ProseMirror h5,
        .novel-editor-dark .ProseMirror h6 {
          color: white !important;
          font-weight: bold !important;
        }

        /* Strong/Bold text */
        .novel-editor-dark .ProseMirror strong {
          color: white !important;
          font-weight: 600 !important;
        }

        /* Emphasis/Italic text */
        .novel-editor-dark .ProseMirror em {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        /* Links */
        .novel-editor-dark .ProseMirror a {
          color: #f59e0b !important; /* summitGold */
          text-decoration: none !important;
        }

        .novel-editor-dark .ProseMirror a:hover {
          text-decoration: underline !important;
        }

        /* Blockquotes */
        .novel-editor-dark .ProseMirror blockquote {
          border-left: 4px solid #f59e0b !important;
          padding-left: 1.5rem !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-style: italic !important;
        }

        /* Lists */
        .novel-editor-dark .ProseMirror ul,
        .novel-editor-dark .ProseMirror ol {
          color: rgba(255, 255, 255, 0.8) !important;
        }

        .novel-editor-dark .ProseMirror li {
          color: rgba(255, 255, 255, 0.8) !important;
          margin-bottom: 0.25rem !important;
        }

        /* Code */
        .novel-editor-dark .ProseMirror code {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #f59e0b !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
        }

        .novel-editor-dark .ProseMirror pre {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
        }

        .novel-editor-dark .ProseMirror pre code {
          background: transparent !important;
        }

        /* Images */
        .novel-editor-dark .ProseMirror img {
          border-radius: 0.75rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          max-width: 100% !important;
          height: auto !important;
        }

        /* Selection */
        .novel-editor-dark .ProseMirror::selection {
          background: rgba(245, 158, 11, 0.3) !important;
        }

        .novel-editor-dark .ProseMirror *::selection {
          background: rgba(245, 158, 11, 0.3) !important;
        }

        /* Slash command menu */
        .novel-editor-dark [data-radix-popper-content-wrapper] {
          background: rgba(0, 0, 0, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.5rem !important;
          backdrop-filter: blur(12px) !important;
        }

        /* Command menu items */
        .novel-editor-dark [role='option'] {
          color: white !important;
        }

        .novel-editor-dark [role='option']:hover,
        .novel-editor-dark [role='option'][data-highlighted] {
          background: rgba(245, 158, 11, 0.2) !important;
          color: #f59e0b !important;
        }

        /* Bubble menu */
        .novel-editor-dark [data-bubble-menu] {
          background: rgba(0, 0, 0, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.5rem !important;
          backdrop-filter: blur(12px) !important;
        }

        .novel-editor-dark [data-bubble-menu] button {
          color: white !important;
          border: none !important;
          background: transparent !important;
          padding: 0.5rem !important;
          border-radius: 0.25rem !important;
          transition: all 0.2s !important;
        }

        .novel-editor-dark [data-bubble-menu] button:hover,
        .novel-editor-dark [data-bubble-menu] button[data-state='on'] {
          background: rgba(245, 158, 11, 0.2) !important;
          color: #f59e0b !important;
        }
      `}</style>
    </div>
  );
}
