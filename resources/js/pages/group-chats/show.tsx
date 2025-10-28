import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Users, MessageSquare, Mic, Crown, UserPlus, UserMinus, ArrowLeft, Trash2, RotateCcw, Square, Play } from 'lucide-react';

interface Participant {
    id: number;
    name: string;
    email: string;
    role: string;
    joined_at: string;
    status: string;
}

interface Creator {
    id: number;
    name: string;
}

interface Session {
    id: number;
    title: string;
    description: string;
    mode: string;
    max_participants: number;
    is_active: boolean;
    creator: Creator;
    participants: Participant[];
    participant_count: number;
    is_creator: boolean;
    is_participant: boolean;
    created_at: string;
}

interface GroupChatsShowProps {
    session: Session;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Group Chats',
        href: '/group-chats',
    },
];

export default function GroupChatsShow({ session }: GroupChatsShowProps) {
    const { flash } = usePage().props as any;

    const handleJoin = () => {
        router.post(`/group-chats/${session.id}/join`);
    };

    const handleLeave = () => {
        router.post(`/group-chats/${session.id}/leave`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this group chat session? This action cannot be undone.')) {
            router.delete(`/group-chats/${session.id}`);
        }
    };

    const handleReenter = () => {
        router.post(`/group-chats/${session.id}/reenter`);
    };

    const handleEndSession = () => {
        if (confirm('Are you sure you want to end this group chat session? Participants will no longer be able to join or chat.')) {
            router.post(`/group-chats/${session.id}/end`);
        }
    };

    const handleStartSession = () => {
        if (confirm('Are you sure you want to start this group chat session? Participants will be able to join and chat again.')) {
            router.post(`/group-chats/${session.id}/start`);
        }
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

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'creator':
                return <Badge variant="secondary" className="flex items-center gap-1"><Crown className="h-3 w-3" />Creator</Badge>;
            case 'moderator':
                return <Badge variant="outline">Moderator</Badge>;
            default:
                return <Badge variant="outline">Participant</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-500">Active</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500">Pending Approval</Badge>;
            case 'removed':
                return <Badge variant="destructive">Removed</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const handleRemoveParticipant = (userId: number) => {
        if (confirm('Are you sure you want to remove this participant from the session?')) {
            router.post(`/group-chats/${session.id}/remove-participant/${userId}`);
        }
    };

    const handleApproveParticipant = (userId: number) => {
        if (confirm('Are you sure you want to approve this participant to join the session?')) {
            router.post(`/group-chats/${session.id}/approve-participant/${userId}`);
        }
    };

    const handleReaddParticipant = (userId: number) => {
        if (confirm('Are you sure you want to re-add this participant to the session?')) {
            router.post(`/group-chats/${session.id}/readd-participant/${userId}`);
        }
    };

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: session.title, href: `/group-chats/${session.id}` }]}>
            <Head title={`${session.title} - Group Chat`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <a href="/group-chats">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Group Chats
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{session.title}</h1>
                            <p className="text-muted-foreground">
                                Created by {session.creator.name} • {new Date(session.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={session.is_active ? "default" : "secondary"}>
                            {session.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            {getModeIcon(session.mode)}
                            {session.mode === 'audio' ? 'Audio' : 'Message'}
                        </Badge>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-300">
                        {flash.error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Session Details */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Session Details</CardTitle>
                                <CardDescription>
                                    Information about this group chat session
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-muted-foreground">
                                        {session.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Mode</h4>
                                        <p className="flex items-center gap-2">
                                            {getModeIcon(session.mode)}
                                            {session.mode === 'audio' ? 'Audio Chat' : 'Message Chat'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm text-muted-foreground">Max Participants</h4>
                                        <p>{session.max_participants}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Participants ({session.participant_count}/{session.max_participants})</h4>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{session.participant_count} joined</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Join/Leave Actions */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Participation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {session.is_participant ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            You are currently a participant in this session.
                                        </p>
                                        <Button
                                            variant="default"
                                            className="w-full"
                                            disabled={!session.is_active}
                                            asChild={!session.is_active ? false : true}
                                        >
                                            {session.is_active ? (
                                                <a href={`/group-chats/${session.id}/chat`}>
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Enter Chat
                                                </a>
                                            ) : (
                                                <>
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Enter Chat (Session Not Started)
                                                </>
                                            )}
                                        </Button>
                                        <div className="space-y-2">
                                            {!session.is_creator && (
                                                <Button
                                                    onClick={handleLeave}
                                                    variant="destructive"
                                                    className="w-full"
                                                >
                                                    <UserMinus className="h-4 w-4 mr-2" />
                                                    Leave Session
                                                </Button>
                                            )}
                                            {session.is_creator && (
                                                <div className="space-y-2">
                                                    {session.is_active ? (
                                                        <Button
                                                            onClick={handleEndSession}
                                                            variant="outline"
                                                            className="w-full"
                                                        >
                                                            <Square className="h-4 w-4 mr-2" />
                                                            End Session
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={handleStartSession}
                                                            variant="default"
                                                            className="w-full"
                                                        >
                                                            <Play className="h-4 w-4 mr-2" />
                                                            Start Session
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={handleDelete}
                                                        variant="destructive"
                                                        className="w-full"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Session
                                                    </Button>
                                                    <p className="text-sm text-muted-foreground text-center">
                                                        As the creator, you cannot leave this session.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Join this session to participate in the discussion.
                                        </p>
                                        {session.is_active && session.participant_count < session.max_participants ? (
                                            <div className="space-y-2">
                                                <Button onClick={handleJoin} className="w-full">
                                                    <UserPlus className="h-4 w-4 mr-2" />
                                                    Join Session
                                                </Button>
                                                <Button variant="outline" className="w-full" asChild>
                                                    <a href={`/group-chats/${session.id}/chat`}>
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Enter Chat
                                                    </a>
                                                </Button>
                                            </div>
                                        ) : session.is_active && session.participant_count >= session.max_participants ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-red-600">
                                                    This session has reached maximum participants.
                                                </p>
                                                <Button onClick={handleReenter} variant="outline" className="w-full">
                                                    <RotateCcw className="h-4 w-4 mr-2" />
                                                    Re-enter Session
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {!session.is_active && (
                                                    <p className="text-sm text-red-600">
                                                        This session is no longer active.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Participants List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Participants</CardTitle>
                        <CardDescription>
                            People currently participating in this group chat session
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {session.participants.filter(p => p.status === 'active').length > 0 ? (
                            <div className="space-y-4">
                                {session.participants.filter(p => p.status === 'active').map((participant) => (
                                    <div key={participant.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{participant.name}</p>
                                                <p className="text-sm text-muted-foreground">{participant.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(participant.role)}
                                            {getStatusBadge(participant.status)}
                                            <span className="text-xs text-muted-foreground">
                                                Joined {new Date(participant.joined_at).toLocaleDateString()}
                                            </span>
                                            {session.is_creator && participant.role !== 'creator' && (
                                                <div className="flex gap-1">
                                                    {participant.status === 'pending' && (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() => handleApproveParticipant(participant.id)}
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {participant.status === 'active' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleRemoveParticipant(participant.id)}
                                                            className="h-6 px-2 text-xs"
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No active participants yet.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Participants */}
                {session.is_creator && session.participants.filter(p => p.status === 'pending').length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Approval</CardTitle>
                            <CardDescription>
                                Participants waiting for approval to join the session
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {session.participants.filter(p => p.status === 'pending').map((participant) => (
                                    <div key={participant.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{participant.name}</p>
                                                <p className="text-sm text-muted-foreground">{participant.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(participant.role)}
                                            {getStatusBadge(participant.status)}
                                            <span className="text-xs text-muted-foreground">
                                                Requested {new Date(participant.joined_at).toLocaleDateString()}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleApproveParticipant(participant.id)}
                                                className="h-6 px-2 text-xs"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Removed Participants */}
                {session.is_creator && session.participants.filter(p => p.status === 'removed').length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Removed Participants</CardTitle>
                            <CardDescription>
                                Participants who have been removed from the session
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {session.participants.filter(p => p.status === 'removed').map((participant) => (
                                    <div key={participant.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{participant.name}</p>
                                                <p className="text-sm text-muted-foreground">{participant.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(participant.role)}
                                            {getStatusBadge(participant.status)}
                                            <span className="text-xs text-muted-foreground">
                                                Removed {new Date(participant.joined_at).toLocaleDateString()}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleReaddParticipant(participant.id)}
                                                className="h-6 px-2 text-xs"
                                            >
                                                Re-add
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}