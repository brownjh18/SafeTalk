import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User as UserType } from '@/types';
import { CalendarIcon, Clock, Search, X, User, Shield, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Group Chats',
        href: '/group-chats',
    },
    {
        title: 'Create',
        href: '/group-chats/create',
    },
];

export default function GroupChatsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        mode: 'message',
        max_participants: 10,
        is_private: false,
        scheduled_date: null as Date | null,
        scheduled_time: '',
        allow_join_after_start: true,
        require_approval: true,
        tags: '',
        meeting_link: '',
        invited_users: [] as number[],
    });

    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [availableUsers, setAvailableUsers] = useState<UserType[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
    const [showUserSearch, setShowUserSearch] = useState(false);

    // Search for users when search term changes
    useEffect(() => {
        if (userSearchTerm.length > 0) {
            fetch(`/api/users/search?q=${encodeURIComponent(userSearchTerm)}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setAvailableUsers(data.users || []);
            })
            .catch(() => {
                setAvailableUsers([]);
            });
        } else {
            setAvailableUsers([]);
        }
    }, [userSearchTerm]);

    // Update invited_users when selectedUsers changes
    useEffect(() => {
        setData('invited_users', selectedUsers.map(user => user.id));
    }, [selectedUsers, setData]);

    const handleUserSelect = (user: UserType) => {
        if (!selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers([...selectedUsers, user]);
        }
        setUserSearchTerm('');
        setShowUserSearch(false);
    };

    const handleUserRemove = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/group-chats');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Group Chat" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Group Chat</h1>
                        <p className="text-muted-foreground">
                            Set up a new group chat session for supportive discussions.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Provide the essential details for your group chat session.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Anxiety Support Group"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the purpose and focus of this group chat..."
                                    rows={3}
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags (optional)</Label>
                                <Input
                                    id="tags"
                                    value={data.tags}
                                    onChange={(e) => setData('tags', e.target.value)}
                                    placeholder="e.g., anxiety, depression, support"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Separate tags with commas to help users find your session.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Session Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Settings</CardTitle>
                            <CardDescription>
                                Configure how your group chat session will operate.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mode">Mode *</Label>
                                    <Select
                                        value={data.mode}
                                        onValueChange={(value) => setData('mode', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="message">Text Chat Only</SelectItem>
                                            <SelectItem value="audio">Audio Chat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.mode && (
                                        <p className="text-sm text-red-600">{errors.mode}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="max_participants">Max Participants *</Label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', parseInt(e.target.value) || 10)}
                                        placeholder="10"
                                        min="2"
                                        max="50"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        Maximum number of participants (2-50).
                                    </p>
                                    {errors.max_participants && (
                                        <p className="text-sm text-red-600">{errors.max_participants}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_private"
                                        checked={data.is_private}
                                        onCheckedChange={(checked) => {
                                            setData('is_private', !!checked);
                                            if (!checked) {
                                                setSelectedUsers([]);
                                            }
                                        }}
                                    />
                                    <Label htmlFor="is_private">Make this session private</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Private sessions are invitation-only and won't appear in public listings.
                                </p>

                                {/* Invite Users Section - Only show when private is checked */}
                                {data.is_private && (
                                    <div className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label>Invite Participants</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Search and select users to invite to this private session.
                                            </p>
                                        </div>

                                        {/* Selected Users Display */}
                                        {selectedUsers.length > 0 && (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Selected Users ({selectedUsers.length})</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedUsers.map((user) => (
                                                        <div key={user.id} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                                                            <User className="h-3 w-3" />
                                                            <span className="text-sm">{user.name}</span>
                                                            <button
                                                                onClick={() => handleUserRemove(user.id)}
                                                                className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* User Search */}
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search for users to invite..."
                                                        value={userSearchTerm}
                                                        onChange={(e) => {
                                                            setUserSearchTerm(e.target.value);
                                                            setShowUserSearch(e.target.value.length > 0);
                                                        }}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* Search Results Dropdown - positioned below the search bar */}
                                            {showUserSearch && userSearchTerm && (
                                                <div className="w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {availableUsers.length > 0 ? (
                                                        availableUsers.map((user) => (
                                                            <div
                                                                key={user.id}
                                                                onClick={() => handleUserSelect(user)}
                                                                className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                                                            >
                                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-primary-foreground" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-medium text-foreground truncate">{user.name}</h4>
                                                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                            user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                            user.role === 'counselor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                        }`}>
                                                                            {user.role}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : userSearchTerm ? (
                                                        <div className="p-4 text-center">
                                                            <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                            <p className="text-sm text-muted-foreground">No users found</p>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="require_approval"
                                        checked={data.require_approval}
                                        onCheckedChange={(checked) => setData('require_approval', !!checked)}
                                    />
                                    <Label htmlFor="require_approval">Require approval for join requests</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Users can join immediately without waiting for approval.
                                </p>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allow_join_after_start"
                                        checked={data.allow_join_after_start}
                                        onCheckedChange={(checked) => setData('allow_join_after_start', !!checked)}
                                    />
                                    <Label htmlFor="allow_join_after_start">Allow joining after session starts</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    If unchecked, only pre-approved participants can join once the session begins.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scheduling */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduling (Optional)</CardTitle>
                            <CardDescription>
                                Schedule your session for a specific date and time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Scheduled Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.scheduled_date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.scheduled_date ? format(data.scheduled_date, "PPP") : "Pick a date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.scheduled_date || undefined}
                                                onSelect={(date) => setData('scheduled_date', date || null)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="scheduled_time">Scheduled Time</Label>
                                    <Input
                                        id="scheduled_time"
                                        type="time"
                                        value={data.scheduled_time}
                                        onChange={(e) => setData('scheduled_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meeting_link">Meeting Link (optional)</Label>
                                <Input
                                    id="meeting_link"
                                    value={data.meeting_link}
                                    onChange={(e) => setData('meeting_link', e.target.value)}
                                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                                />
                                <p className="text-sm text-muted-foreground">
                                    Add a Zoom, Google Meet, or other video conferencing link for hybrid sessions.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <a href="/group-chats">Cancel</a>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Group Chat'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
