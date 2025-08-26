'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, Calendar, BookOpen } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export function NoteManager(): JSX.Element {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('lummu-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]): void => {
    localStorage.setItem('lummu-notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = (): void => {
    if (!title.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    };

    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    resetForm();
    setIsDialogOpen(false);
  };

  const handleUpdateNote = (): void => {
    if (!selectedNote || !title.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === selectedNote.id
        ? {
            ...note,
            title: title.trim(),
            content: content.trim(),
            updatedAt: new Date(),
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          }
        : note
    );

    saveNotes(updatedNotes);
    resetForm();
    setIsDialogOpen(false);
    setEditMode(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = (noteId: string): void => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const openEditDialog = (note: Note): void => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = (): void => {
    resetForm();
    setEditMode(false);
    setSelectedNote(null);
    setIsDialogOpen(true);
  };

  const resetForm = (): void => {
    setTitle('');
    setContent('');
    setTags('');
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">My Notes</h2>
          <Badge variant="secondary">{notes.length}</Badge>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editMode ? 'Edit Note' : 'Create New Note'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
              <Textarea
                placeholder="Start writing your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <Input
                placeholder="Tags (comma-separated)..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editMode ? handleUpdateNote : handleCreateNote}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={!title.trim()}
                >
                  {editMode ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map(note => (
            <Card key={note.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {note.title}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(note);
                      }}
                      className="h-8 w-8 p-0 hover:bg-purple-100"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(note.updatedAt)}
                </div>
              </CardHeader>
              <CardContent>
                {note.content && (
                  <p className="text-gray-600 line-clamp-3 mb-3">
                    {note.content}
                  </p>
                )}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No notes found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first note to get started
              </p>
              <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Note
              </Button>
            </>
