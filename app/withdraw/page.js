'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addFinancialTransaction  } from '../actions/financialActions';
import { toast } from 'react-hot-toast';

const WithdrawPage = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const result = await addFinancialTransaction({
                transaction_type: 'withdrawal',
                amount: parseFloat(formData.get('amount')),
                payment_method: formData.get('withdrawalMethod'),
                person_involved: formData.get('recipient'),
                purpose: formData.get('purpose'),
                notes: formData.get('notes'),
            });
            if (result.status === 201) {
                toast.success('Withdrawal successful');
                e.target.reset();
            } else {
                toast.error(`Withdrawal failed: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred during the withdrawal process.');
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Make a Withdrawal</CardTitle>
                    <CardDescription>Withdraw funds from the school&apos;s account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    placeholder="Enter withdrawal amount"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="withdrawalMethod">Withdrawal Method</Label>
                                <Select name="withdrawalMethod" defaultValue="cash">
                                    <SelectTrigger id="withdrawalMethod">
                                        <SelectValue placeholder="Select withdrawal method" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="recipient">Recipient</Label>
                                <Input id="recipient" name="recipient" placeholder="Enter recipient name" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Input id="purpose" name="purpose" placeholder="Enter purpose of withdrawal" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea id="notes" name="notes" placeholder="Add any additional notes or details" />
                            </div>
                            <Button type="submit" className="bg-red-600 hover:bg-red-700">Submit Withdrawal</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default WithdrawPage;
