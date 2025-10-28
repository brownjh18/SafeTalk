import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Megaphone, Calendar } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    message: string;
    target_roles: string[];
    is_active: boolean;
    created_at: string;
}

interface Props {
    announcements: Announcement[];
}

export default function Index({ announcements }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Announcements" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Megaphone className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">Announcements</h1>
                            <p className="text-muted-foreground">
                                Stay updated with important announcements and updates
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    {announcements.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Megaphone className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    No announcements yet
                                </h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Announcements will appear here when they are posted by administrators.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        announcements.map((announcement) => (
                            <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{announcement.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(announcement.created_at)}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary" className="ml-4">
                                            Announcement
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {announcement.message}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}