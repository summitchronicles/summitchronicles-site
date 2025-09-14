"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import HardBreak from '@tiptap/extension-hard-break';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
  CheckIcon,
  ChatBubbleLeftIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  PaintBrushIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface AdvancedEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuButton = ({ onClick, active = false, disabled = false, children, title }: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg border transition-all duration-200 ${
      active 
        ? 'bg-summitGold text-black border-summitGold' 
        : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </button>
);

const ColorPicker = ({ onColorChange, currentColor }: { onColorChange: (color: string) => void; currentColor: string }) => {
  const colors = [
    '#FFFFFF', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6',
    '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280', '#000000'
  ];

  return (
    <div className="flex gap-1 p-2 bg-black/90 border border-white/20 rounded-lg">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-6 h-6 rounded border-2 ${
            currentColor === color ? 'border-summitGold' : 'border-white/20'
          }`}
          style={{ backgroundColor: color }}
          title={`Set color to ${color}`}
        />
      ))}
    </div>
  );
};

export default function AdvancedEditor({
  content,
  onChange,
  placeholder = "Start writing your story...",
  className = ""
}: AdvancedEditorProps) {
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure paragraph to preserve empty lines
        paragraph: {
          HTMLAttributes: {
            class: 'paragraph-block',
          },
        },
        // Disable default hard break from StarterKit to use our custom one
        hardBreak: false,
      }),
      // Custom hard break that allows Shift+Enter for line breaks
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            'Shift-Enter': () => this.editor.commands.setHardBreak(),
          }
        },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-summitGold hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto shadow-2xl',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
        'data-placeholder': placeholder,
      },
    },
    immediatelyRender: false,
  });

  const uploadImageFile = useCallback(async (file: File) => {
    if (!editor) return;

    try {
      // Show loading state by inserting a placeholder
      editor.chain().focus().setImage({ src: '/placeholder.svg', alt: 'Uploading...' }).run();
      
      // Create FormData and upload to API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Replace placeholder with actual uploaded image
      editor.commands.setImage({ src: data.url, alt: file.name });

    } catch (error) {
      console.error('Image upload failed:', error);
      // Remove the placeholder image on error
      editor.commands.deleteSelection();
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [editor]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Upload all selected files
    for (let i = 0; i < files.length; i++) {
      await uploadImageFile(files[i]);
    }

    // Reset input
    event.target.value = '';
  }, [uploadImageFile]);

  const addLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    
    setLinkUrl('');
    setShowLinkDialog(false);
  }, [editor, linkUrl]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please drop image files only');
      return;
    }

    // Upload all image files
    for (const file of imageFiles) {
      await uploadImageFile(file);
    }
  }, [uploadImageFile]);

  if (!mounted || !editor) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-[500px] flex items-center justify-center">
        <div className="text-white/60">Loading advanced editor...</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-white/10 p-4 bg-white/5">
          <div className="flex flex-wrap gap-2">
            {/* Text Formatting */}
            <div className="flex gap-1">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Bold (Ctrl+B)"
              >
                <BoldIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Italic (Ctrl+I)"
              >
                <ItalicIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')}
                title="Underline (Ctrl+U)"
              >
                <UnderlineIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                active={editor.isActive('strike')}
                title="Strikethrough"
              >
                <StrikethroughIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive('code')}
                title="Inline Code"
              >
                <CodeBracketIcon className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Highlight */}
            <div className="relative flex gap-1">
              <MenuButton
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                active={showHighlightPicker || editor.isActive('highlight')}
                title="Highlight"
              >
                <PaintBrushIcon className="w-4 h-4" />
              </MenuButton>
              
              {showHighlightPicker && (
                <div className="absolute top-12 left-0 z-50">
                  <ColorPicker
                    onColorChange={(color) => {
                      editor.chain().focus().setHighlight({ color }).run();
                      setShowHighlightPicker(false);
                    }}
                    currentColor={editor.getAttributes('highlight').color || '#F59E0B'}
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Headings */}
            <div className="flex gap-1">
              <select
                onChange={(e) => {
                  const level = parseInt(e.target.value);
                  if (level === 0) {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level }).run();
                  }
                }}
                className="bg-white/5 text-white border border-white/10 rounded-lg px-2 py-1 text-sm"
                value={
                  editor.isActive('heading', { level: 1 }) ? 1 :
                  editor.isActive('heading', { level: 2 }) ? 2 :
                  editor.isActive('heading', { level: 3 }) ? 3 :
                  editor.isActive('heading', { level: 4 }) ? 4 :
                  editor.isActive('heading', { level: 5 }) ? 5 :
                  editor.isActive('heading', { level: 6 }) ? 6 : 0
                }
              >
                <option value={0}>Paragraph</option>
                <option value={1}>Heading 1</option>
                <option value={2}>Heading 2</option>
                <option value={3}>Heading 3</option>
                <option value={4}>Heading 4</option>
                <option value={5}>Heading 5</option>
                <option value={6}>Heading 6</option>
              </select>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Alignment */}
            <div className="flex gap-1">
              <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                active={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
              >
                <Bars3BottomLeftIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                active={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
              >
                <Bars3Icon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                active={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
              >
                <Bars3BottomRightIcon className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Lists */}
            <div className="flex gap-1">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Bullet List"
              >
                <ListBulletIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Numbered List"
              >
                <NumberedListIcon className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Media & Links */}
            <div className="flex gap-1">
              <MenuButton
                onClick={() => fileInputRef.current?.click()}
                title="Insert Image"
              >
                <PhotoIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => setShowLinkDialog(true)}
                active={editor.isActive('link')}
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </MenuButton>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Special */}
            <div className="flex gap-1">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive('blockquote')}
                title="Quote"
              >
                <ChatBubbleLeftIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
              >
                <MinusIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                active={editor.isActive('codeBlock')}
                title="Code Block"
              >
                <CodeBracketIcon className="w-4 h-4" />
              </MenuButton>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div 
          className={`relative ${isDragging ? 'bg-summitGold/10 border-2 border-dashed border-summitGold' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EditorContent editor={editor} />
          
          {/* Drag & Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-summitGold/10 border-2 border-dashed border-summitGold rounded-xl flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <PhotoIcon className="w-12 h-12 text-summitGold mx-auto mb-2" />
                <p className="text-summitGold font-semibold">Drop images here to upload</p>
              </div>
            </div>
          )}
          
          {/* Hidden file input for images */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Add Link</h3>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/50 mb-4"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addLink();
                  } else if (e.key === 'Escape') {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowLinkDialog(false);
                    setLinkUrl('');
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addLink}
                  className="px-4 py-2 bg-summitGold text-black rounded-lg hover:bg-summitGold/80 transition-colors font-medium"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-white/10 p-3 bg-white/5">
          <div className="flex items-center justify-between text-xs text-white/50">
            <div className="flex gap-4">
              <span>🎨 Rich formatting toolbar</span>
              <span>🖼️ Upload & drag-drop images</span>
              <span>⏎ Enter for new paragraph</span>
              <span>⇧⏎ Shift+Enter for line break</span>
            </div>
            <div>Advanced rich text editor</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Advanced Editor Dark Theme */
        .ProseMirror {
          background: transparent !important;
          color: white !important;
          border: none !important;
          outline: none !important;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          color: rgba(255, 255, 255, 0.4) !important;
          content: attr(data-placeholder) !important;
          float: left !important;
          height: 0 !important;
          pointer-events: none !important;
          font-style: italic !important;
        }
        
        /* Headings */
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
        .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
          color: white !important;
          font-weight: bold !important;
          margin: 1.5em 0 0.5em 0 !important;
        }
        
        .ProseMirror h1 { font-size: 2.25em !important; }
        .ProseMirror h2 { font-size: 1.875em !important; }
        .ProseMirror h3 { font-size: 1.5em !important; }
        .ProseMirror h4 { font-size: 1.25em !important; }
        .ProseMirror h5 { font-size: 1.125em !important; }
        .ProseMirror h6 { font-size: 1em !important; }
        
        /* Text styles */
        .ProseMirror p {
          color: rgba(255, 255, 255, 0.8) !important;
          line-height: 1.7 !important;
          margin: 1em 0 !important;
          min-height: 1.2em !important; /* Preserve empty paragraph height */
        }
        
        /* Ensure empty paragraphs are visible and preserved */
        .ProseMirror p:empty::before {
          content: '\\200B' !important; /* Zero-width space to preserve empty paragraphs */
          display: inline-block !important;
        }
        
        /* Hard break styling for Shift+Enter line breaks */
        .ProseMirror br {
          display: block !important;
          content: '' !important;
          margin-top: 0.5em !important;
        }
        
        .ProseMirror strong { font-weight: 600 !important; color: white !important; }
        .ProseMirror em { color: rgba(255, 255, 255, 0.9) !important; }
        .ProseMirror u { text-decoration: underline !important; }
        .ProseMirror s { text-decoration: line-through !important; }
        
        /* Links */
        .ProseMirror a {
          color: #F59E0B !important;
          text-decoration: none !important;
        }
        .ProseMirror a:hover { text-decoration: underline !important; }
        
        /* Lists */
        .ProseMirror ul, .ProseMirror ol {
          color: rgba(255, 255, 255, 0.8) !important;
          margin: 0.75em 0 !important;
          padding-left: 1.5em !important;
        }
        
        .ProseMirror li {
          color: rgba(255, 255, 255, 0.8) !important;
          margin: 0.25em 0 !important;
        }
        
        /* Blockquotes */
        .ProseMirror blockquote {
          border-left: 4px solid #F59E0B !important;
          padding-left: 1.5rem !important;
          margin: 1.5em 0 !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-style: italic !important;
        }
        
        /* Code */
        .ProseMirror code {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #F59E0B !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
          font-family: 'Courier New', monospace !important;
        }
        
        .ProseMirror pre {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
          margin: 1.5em 0 !important;
          overflow-x: auto !important;
        }
        
        .ProseMirror pre code {
          background: transparent !important;
          color: white !important;
        }
        
        /* Images */
        .ProseMirror img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          margin: 1.5em 0 !important;
        }
        
        /* Horizontal rule */
        .ProseMirror hr {
          border: none !important;
          border-top: 2px solid rgba(255, 255, 255, 0.2) !important;
          margin: 2em 0 !important;
        }
        
        /* Selection */
        .ProseMirror::selection { background: rgba(245, 158, 11, 0.3) !important; }
        .ProseMirror *::selection { background: rgba(245, 158, 11, 0.3) !important; }
        
        /* Focus */
        .ProseMirror:focus { outline: none !important; }
        
        /* Text alignment */
        .ProseMirror [data-text-align="left"] { text-align: left !important; }
        .ProseMirror [data-text-align="center"] { text-align: center !important; }
        .ProseMirror [data-text-align="right"] { text-align: right !important; }
        .ProseMirror [data-text-align="justify"] { text-align: justify !important; }
        
        /* Highlight colors */
        .ProseMirror mark { 
          border-radius: 0.25rem !important; 
          padding: 0.125rem !important; 
        }
      `}</style>
    </div>
  );
}