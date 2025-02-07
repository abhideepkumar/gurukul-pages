import React from 'react';
import { Card} from '@/components/ui/card';

const DataCard = ({ subject, value, color }) => {
    return (
        <Card className={`${color} p-4 rounded-md border-none`}>
        <div className="flex items-center justify-between">
            <div className="text-slate-800 px-5">{subject}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    </Card>
    );
};

export default DataCard;
