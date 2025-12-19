import React from "react";
import TransactionForm from "@/views/transactions/form";
import { PageHeader, PageTitle, PageDescription } from "@/components/common";

const NewTransactionPage = () => {
  return (
    <div>
      <PageHeader>
        <PageTitle>Transaction Form</PageTitle>
        <PageDescription>Create a new transaction</PageDescription>
      </PageHeader>
      <TransactionForm />
    </div>
  );
};

export default NewTransactionPage;
