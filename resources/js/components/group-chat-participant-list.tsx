import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, UserMinus, UserPlus, RotateCcw, X, Loader2 } from 'lucide-react';

interface Participant {
    id: number;
    name: string;
    email: string;
    role: string;
    joined_at: string;
    status: string;
}

interface GroupChatParticipantListProps {
    participants: Participant[];
    isCreator: boolean;
    onRemoveParticipant?: (userId: number) => void;
    onApproveParticipant?: (userId: number) => void;
    onRejectParticipant?: (userId: number) => void;
    onReaddParticipant?: (userId: number) => void;
    showPending?: boolean;
    showRemoved?: boolean;
}

export default function GroupChatParticipantList({
    participants,
    isCreator,
    onRemoveParticipant,
    onApproveParticipant,
    onRejectParticipant,
    onReaddParticipant,
    showPending = true,
    showRemoved = true
}: GroupChatParticipantListProps) {
    const [loadingActions, setLoadingActions] = useState<{[key: string]: boolean}>({});
    const [localParticipants, setLocalParticipants] = useState<Participant[]>(participants);

    // Update local state when participants prop changes
    React.useEffect(() => {
        setLocalParticipants(participants);
    }, [participants]);

    const handleApprove = async (userId: number) => {
        if (!onApproveParticipant) return;

        setLoadingActions(prev => ({ ...prev, [`approve-${userId}`]: true }));
        try {
            await onApproveParticipant(userId);
            // Remove the participant from the pending list immediately
            setLocalParticipants(prev => prev.filter(p => p.id !== userId));
        } catch (error) {
            console.error('Failed to approve participant:', error);
        } finally {
            setLoadingActions(prev => ({ ...prev, [`approve-${userId}`]: false }));
        }
    };

    const handleReject = async (userId: number) => {
        if (!onRejectParticipant) return;

        setLoadingActions(prev => ({ ...prev, [`reject-${userId}`]: true }));
        try {
            await onRejectParticipant(userId);
            // Remove the participant from the pending list immediately
            setLocalParticipants(prev => prev.filter(p => p.id !== userId));
        } catch (error) {
            console.error('Failed to reject participant:', error);
        } finally {
            setLoadingActions(prev => ({ ...prev, [`reject-${userId}`]: false }));
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
            case 'invited':
                return <Badge variant="secondary" className="bg-blue-500">Invited</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const activeParticipants = localParticipants.filter(p => p.status === 'active');
    const invitedParticipants = localParticipants.filter(p => p.status === 'invited');
    const pendingParticipants = showPending ? localParticipants.filter(p => p.status === 'pending') : [];
    const removedParticipants = showRemoved ? localParticipants.filter(p => p.status === 'removed') : [];

    return (
        <div className="space-y-6">
            {/* Active Participants */}
            {activeParticipants.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Active Participants ({activeParticipants.length})</h3>
                    <div className="space-y-4">
                        {activeParticipants.map((participant) => (
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
                                    {isCreator && participant.role !== 'creator' && onRemoveParticipant && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onRemoveParticipant(participant.id)}
                                            className="h-6 px-2 text-xs"
                                        >
                                            <UserMinus className="h-3 w-3 mr-1" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Invited Participants */}
            {invitedParticipants.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Invited Participants ({invitedParticipants.length})</h3>
                    <div className="space-y-4">
                        {invitedParticipants.map((participant) => (
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
                                        Invited {new Date(participant.joined_at).toLocaleDateString()}
                                    </span>
                                    {isCreator && participant.role !== 'creator' && onRemoveParticipant && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onRemoveParticipant(participant.id)}
                                            className="h-6 px-2 text-xs"
                                        >
                                            <UserMinus className="h-3 w-3 mr-1" />
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Participants */}
            {pendingParticipants.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Pending Approval ({pendingParticipants.length})</h3>
                    <div className="space-y-4">
                        {pendingParticipants.map((participant) => (
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
                                    {isCreator && (
                                        <div className="flex gap-1">
                                            {onApproveParticipant && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleApprove(participant.id)}
                                                    disabled={loadingActions[`approve-${participant.id}`]}
                                                    className="h-6 px-2 text-xs"
                                                >
                                                    {loadingActions[`approve-${participant.id}`] ? (
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    ) : (
                                                        <UserPlus className="h-3 w-3 mr-1" />
                                                    )}
                                                    Approve
                                                </Button>
                                            )}
                                            {onRejectParticipant && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleReject(participant.id)}
                                                    disabled={loadingActions[`reject-${participant.id}`]}
                                                    className="h-6 px-2 text-xs"
                                                >
                                                    {loadingActions[`reject-${participant.id}`] ? (
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    ) : (
                                                        <X className="h-3 w-3 mr-1" />
                                                    )}
                                                    Reject
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Removed Participants */}
            {removedParticipants.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Removed Participants ({removedParticipants.length})</h3>
                    <div className="space-y-4">
                        {removedParticipants.map((participant) => (
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
                                    {isCreator && onReaddParticipant && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onReaddParticipant(participant.id)}
                                            className="h-6 px-2 text-xs"
                                        >
                                            <RotateCcw className="h-3 w-3 mr-1" />
                                            Re-add
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {localParticipants.length === 0 && (
                <p className="text-muted-foreground">No participants yet.</p>
            )}
        </div>
    );
}