import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, MessageSquare, Mic, Save, X } from 'lucide-react';

interface Session {
    id: number;
    title: string;
    description: string;
    mode: string;
    max_participants: number;
    is_active: boolean;
    is_creator: boolean;
}

interface GroupChatSettingsProps {
    session: Session;
    onUpdateSettings: (settings: Partial<Session>) => void;
    onEndSession?: () => void;
    onStartSession?: () => void;
    onDeleteSession?: () => void;
}

export default function GroupChatSettings({
    session,
    onUpdateSettings,
    onEndSession,
    onStartSession,
    onDeleteSession
}: GroupChatSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
        title: session.title,
        description: session.description,
        mode: session.mode,
        max_participants: session.max_participants,
        is_active: session.is_active
    });

    const handleSave = () => {
        onUpdateSettings(settings);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSettings({
            title: session.title,
            description: session.description,
            mode: session.mode,
            max_participants: session.max_participants,
            is_active: session.is_active
        });
        setIsEditing(false);
    };

    const getModeIcon = (mode: string) => {
        switch (mode) {
            case 'audio':
                return <Mic className="h-4 w-4" />;
            case 'message':
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    if (!session.is_creator) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Session Settings
                    </CardTitle>
                    <CardDescription>
                        Only the session creator can modify settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">Mode</Label>
                            <div className="flex items-center gap-2 mt-1">
                                {getModeIcon(session.mode)}
                                <span className="capitalize">{session.mode}</span>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">Max Participants</Label>
                            <p className="mt-1">{session.max_participants}</p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <div className="mt-1">
                            <Badge variant={session.is_active ? "default" : "secondary"}>
                                {session.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Session Settings
                </CardTitle>
                <CardDescription>
                    Manage your group chat session settings
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isEditing ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={settings.title}
                                onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Group chat title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={settings.description}
                                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe the purpose of this group chat..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="mode">Mode</Label>
                                <Select
                                    value={settings.mode}
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, mode: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="message">Message Only</SelectItem>
                                        <SelectItem value="audio">Audio Chat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_participants">Max Participants</Label>
                                <Input
                                    id="max_participants"
                                    type="number"
                                    value={settings.max_participants}
                                    onChange={(e) => setSettings(prev => ({
                                        ...prev,
                                        max_participants: parseInt(e.target.value) || 10
                                    }))}
                                    min="2"
                                    max="50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={settings.is_active}
                                onChange={(e) => setSettings(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="is_active">Session Active</Label>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleSave} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                            <Button onClick={handleCancel} variant="outline" size="sm">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Mode</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    {getModeIcon(session.mode)}
                                    <span className="capitalize">{session.mode}</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Max Participants</Label>
                                <p className="mt-1">{session.max_participants}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <div className="mt-1">
                                <Badge variant={session.is_active ? "default" : "secondary"}>
                                    {session.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>

                        <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Settings
                        </Button>
                    </div>
                )}

                {/* Session Management Actions */}
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Session Management</h4>
                    <div className="space-y-2">
                        {session.is_active ? (
                            <Button
                                onClick={onEndSession}
                                variant="outline"
                                className="w-full"
                                size="sm"
                            >
                                End Session
                            </Button>
                        ) : (
                            <Button
                                onClick={onStartSession}
                                variant="default"
                                className="w-full"
                                size="sm"
                            >
                                Start Session
                            </Button>
                        )}

                        <Button
                            onClick={onDeleteSession}
                            variant="destructive"
                            className="w-full"
                            size="sm"
                        >
                            Delete Session
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}