'use client';
import * as React from 'react';
import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Timer,
  CheckCheck,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { updateTodo, deleteTodo, statusTodo } from '@/features/todo/todo-slice';
import { useDispatch } from 'react-redux';

export type Todos = {
  id: number;
  title: string;
  status: 'In Progress' | 'Done';
  priority?: boolean;
};

export const columns: ColumnDef<Todos>[] = [
  {
    id: 'select',
    accessorKey: 'id',
    header: ({ table }) => (
      <div className='flex items-center gap-2'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />{' '}
        Task
      </div>
    ),
    cell: ({ row }) => {
      const task = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(values) => {
              row.toggleSelected(!!values);
            }}
            aria-label='Select row'
          />
          {task.id}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Todos',
    cell: ({ row }) => {
      const todos = row.original;

      return (
        <div className='flex items-center gap-1'>
          {todos.priority === false ? (
            <>{todos.title}</>
          ) : (
            <>
              {todos.title}
              <Image
                src={'./favorite-svgrepo-com.svg'}
                alt='favorite'
                width={10000}
                height={10000}
                loading='lazy'
                className='w-4 h-4 object-cover'
              />
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original;

      return (
        <div className='flex items-center gap-2'>
          {status.status === 'In Progress' ? (
            <>
              <Timer size={20} /> {status.status}
            </>
          ) : (
            <>
              <CheckCheck size={20} /> {status.status}
            </>
          )}
        </div>
      );
    },
  },
  {
    id: 'toggle',
    header: 'Toggle',
    cell: ({ row }) => {
      const toggle = row.original;
      const dispatch = useDispatch();

      const onHandleChangeStatus = () => {
        const newStatus =
          toggle.status === 'In Progress' ? 'Done' : 'In Progress';
        dispatch(
          statusTodo({
            id: toggle.id,
            status: newStatus,
          })
        );
        toast(
          `Todo has been ${
            newStatus === 'Done' ? 'Done' : 'set to In Progress'
          }`
        );
      };

      return (
        <div className='flex items-center space-x-2'>
          <Switch
            checked={toggle.status === 'Done'}
            onClick={onHandleChangeStatus}
          />
          <Label className='mobile:text-xs'>Done</Label>
        </div>
      );
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.original;
      const dispatch = useDispatch();
      const [selectedId, setSelectedId] = React.useState<number | null>(
        action.id
      );
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      const [editTextarea, setEditTextarea] = React.useState(action.title);

      const onHandleSaveChanges = () => {
        if (selectedId) {
          dispatch(
            updateTodo({
              id: action.id,
              title: editTextarea,
            })
          );
          toast('Todos has been changes');
          setIsDialogOpen(false);
        }
      };

      const onHandleDeletedTodos = () => {
        dispatch(
          deleteTodo({
            id: action.id,
          })
        );
        toast('Deleted success');
      };

      const onHandleGetId = () => {
        setSelectedId(action.id);
      };
      return (
        <>
          <div className='flex items-center space-x-2 mobile:hidden'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={'outline'} onClick={onHandleGetId}>
                  Edit todos
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w[425px]'>
                <DialogHeader>
                  <DialogTitle>Edit todos</DialogTitle>
                  <DialogDescription>
                    Make changes to your todos here. Click save when you're
                    done.
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
                <Button variant={'destructive'} onClick={onHandleGetId}>
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your todos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onHandleDeletedTodos}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className='flex items-center sm:hidden'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className='h-8 w-10 p-0'>
                  <span className='sr-only'>Open Action</span>
                  <MoreHorizontal className='h-6 w-8' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={onHandleGetId}
                      variant={'ghost'}
                      className='flex items-center justify-center w-full gap-2 h-8'
                    >
                      <Pencil size={15} />
                      Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w[425px]'>
                    <DialogHeader>
                      <DialogTitle>Edit todos</DialogTitle>
                      <DialogDescription>
                        Make changes to your todos here. Click save when you're
                        done.
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
                    <Button
                      variant={'ghost'}
                      onClick={onHandleGetId}
                      className='text-red-500 flex items-center justify-center w-full gap-2 h-8 hover:text-red-500'
                    >
                      <Trash2 size={15} />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your todos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onHandleDeletedTodos}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      );
    },
  },
];
