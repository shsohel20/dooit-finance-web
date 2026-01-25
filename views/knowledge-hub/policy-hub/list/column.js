export const getPolicyHubColumns=()=>{
  return [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
    },
    {
      id: 'description',
      header: 'Description',
      accessorKey: 'description',
    },
    {
      id: 'updatedAt',
      header: 'Updated At',
      accessorKey: 'updatedAt',
    },
    {
      id: 'createdAt',
      header: 'Created At',
      accessorKey: 'createdAt',
    },
  ]
}