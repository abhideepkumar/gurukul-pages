'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon, ImportIcon } from '@/assets/icons';

const Students = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-4">
                    <Link href="/students/add-students">
                        <Button variant="outline" className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            Add a student
                        </Button>
                    </Link>
                    <Link href="/students/import-students">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ImportIcon className="h-4 w-4" />
                            Import file
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium text-muted-foreground">Total Students</div>
                            <div className="text-3xl font-bold">1,125</div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-medium text-muted-foreground">Current Session</div>
                            <div className="text-3xl font-bold">2024-2025</div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-sm text-muted-foreground">
                    You can bulk-add students in CSV, XSL, or XLSX file formats.{' '}
                    <Link href="#" className="underline hover:text-primary" prefetch={false}>
                        Download sample
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Students;
