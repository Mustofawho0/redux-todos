'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export type Todos = {
  id: number;
  title: string;
  status: 'processing' | 'complete';
};

export const columns: ColumnDef<Todos>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'title',
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant={'ghost'}
    //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //     >
    //       <span className='font-semibold'>Todos</span>
    //       <ArrowUpDown className='ml-2 h-4 w-4' />
    //     </Button>
    //   );
    // },
    header: 'Todos',
    cell: (row) => row.getValue(),
  },
  {
    accessorKey: 'status',
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant={'ghost'}
    //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //     >
    //       <span className='font-semibold'>Status</span>
    //       <ArrowUpDown className='ml-2 h-4 w-4' />
    //     </Button>
    //   );
    // },
    header: 'Status',
    cell: (row) => row.getValue(),
  },
  {
    id: 'toggle',
    header: 'Toggle',
    cell: ({ row }) => {
      const toggle = row.original;
      return (
        <div className='flex items-center space-x-2'>
          <Switch
            id='completed'
            onClick={() => navigator.clipboard.writeText(toggle.id.toString())}
          />
          <Label htmlFor='completed'>Complete</Label>
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.original;
      const [editTextarea, setEditTextarea] = React.useState(action.title);

      const onHandleSaveChanges = () => {
        toast('Todos has been changes');
      };
      return (
        <div className='flex items-center space-x-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={'outline'}>Edit todos</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w[425px]'>
              <DialogHeader>
                <DialogTitle>Edit todos</DialogTitle>
                <DialogDescription>
                  Make changes to your todos here. Click save when you're done.
                </DialogDescription>
                <DialogDescription>
                  <Textarea
                    placeholder='Type your todos here'
                    value={editTextarea}
                    onChange={(e) => setEditTextarea(e.target.value)}
                  />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type='submit' onClick={onHandleSaveChanges}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive'}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
