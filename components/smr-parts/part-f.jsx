'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { TransactionForm } from '../transaction-form';
import { useEffect } from 'react';

export function PartF({ data, updateData }) {
  const [transactions, setTransactions] = useState(
    data.transactions || [createEmptyTransaction()]
  );
  useEffect(() => {
    //date should suppport input type date 2025-11-28
    const transactions = data.transactions.map((transaction) => {
      const date = transaction.date
        ? new Date(transaction.date).toISOString().split('T')[0]
        : '';
      return {
        ...transaction,
        date,
      };
    });
    // console.log('transactions', transactions);
    setTransactions(transactions);
  }, [data]);

  function createEmptyTransaction() {
    return {
      date: '',
      type: '',
      completed: true,
      referenceNumber: '',
      totalAmount: { currencyCode: 'AUD', amount: 0 },
      cashAmount: { currencyCode: 'AUD', amount: 0 },
      foreignCurrencies: [],
      digitalCurrencies: [],
      sender: { name: '', institutions: [] },
      payee: { name: '', institutions: [] },
      beneficiary: { name: '', institutions: [] },
    };
  }

  const handleAdd = () => {
    const updated = [...transactions, createEmptyTransaction()];
    setTransactions(updated);
    updateData({ transactions: updated });
  };

  const handleUpdate = (index, transaction) => {
    const updated = [...transactions];
    updated[index] = transaction;
    setTransactions(updated);
    updateData({ transactions: updated });
  };

  const handleRemove = (index) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    updateData({ transactions: updated });
  };

  console.log('transactions in part f', transactions);
  return (
    <div className="space-y-6">
      {transactions.map((transaction, index) => (
        <div
          key={index}
          className="p-6 bg-secondary/30 rounded-lg border-2 border-muted"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold ">Transaction {index + 1}</h3>
            {transactions.length > 1 && (
              <Button
                type="button"
                onClick={() => handleRemove(index)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          <TransactionForm
            data={transaction}
            onUpdate={(updated) => handleUpdate(index, updated)}
          />
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAdd}
        variant="outline"
        className="border bg-transparent"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add another transaction
      </Button>
    </div>
  );
}
