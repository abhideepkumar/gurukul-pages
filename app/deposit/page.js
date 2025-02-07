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

const DepositPage = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const result = await addFinancialTransaction ({
                transaction_type: 'deposit',
                amount: parseFloat(formData.get('amount')),
                payment_method: formData.get('paymentMethod'),
                person_involved: formData.get('payer'),
                notes: formData.get('notes'),
                purpose: formData.get('purpose'),
            });
            if (result.status === 201) {
                toast.success('Deposit successful');
                e.target.reset();
            } else {
                toast.error(`Deposit failed: ${result.error}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred during the deposit process.');
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Make a Deposit</CardTitle>
                    <CardDescription>Add funds to the school&apos;s account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    placeholder="Enter deposit amount"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="paymentMethod">Payment Method</Label>
                                <Select name="paymentMethod" defaultValue="cash">
                                    <SelectTrigger id="paymentMethod">
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="payer">Payer</Label>
                                <Input id="payer" name="payer" placeholder="Enter payer's name" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Input id="purpose" name="purpose" placeholder="Enter purpose of deposit" required />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea id="notes" name="notes" placeholder="Add any additional notes or details" />
                            </div>
                            <Button type="submit">Submit Deposit</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DepositPage;
