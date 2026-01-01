import React, { useState, useEffect } from 'react';
import { FileText, Save, X, Plus } from 'lucide-react';

export const SessionNotes = ({ sessionId, initialNote = '', onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    // Load saved notes
    const saved = localStorage.getItem(`session-note-${sessionId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setNote(data.note || '');
      setTags(data.tags || []);
    }
  }, [sessionId]);

  const handleSave = () => {
    const noteData = {
      note,
      tags,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`session-note-${sessionId}`, JSON.stringify(noteData));
    
    if (onSave) {
      onSave(noteData);
    }
    
    setIsOpen(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 text-purple-300 text-sm"
      >
        <FileText className="w-4 h-4" />
        {note ? 'View Note' : 'Add Note'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Session Notes</h3>
              <p className="text-sm text-gray-400">Add context to your session</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Note Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What did you work on? How did you feel? Any insights?"
            className="w-full h-40 bg-slate-800 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-400 mb-2 block">
            Tags
          </label>
          <div className="flex gap-2 mb-3 flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 flex items-center gap-2"
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              className="flex-1 bg-slate-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 text-purple-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Quick Tags:</div>
          <div className="flex gap-2 flex-wrap">
            {['work', 'study', 'personal', 'project', 'reading', 'coding'].map((quickTag) => (
              <button
                key={quickTag}
                onClick={() => {
                  if (!tags.includes(quickTag)) {
                    setTags([...tags, quickTag]);
                  }
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-gray-400 hover:text-purple-300 transition-all duration-300"
              >
                #{quickTag}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Note
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-400 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};