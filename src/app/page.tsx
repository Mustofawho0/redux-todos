'use client';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '@/features/todo/todo-slice';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/table/table-todos';
import { Todos, columns } from '@/components/table/column-todos';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

export default function Home() {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const todos = useSelector((state: any) => state.todos.todos);
  const dispatch = useDispatch();
  const form = useForm();

  const Loading = dynamic(() => import('../components/loading'), {
    ssr: false,
  });

  const handleOnSubmit = () => {
    dispatch(
      addTodo({
        title: value,
      })
    );
    form.reset();
    setValue('');
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  });

  return (
    <main>
      <div className={cn('min-h-screen flex items-center justify-center')}>
        {loading ? (
          <Loading />
        ) : (
          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle className='text-center font-sans tracking-wide'>
                List my ToDo 🐣
              </CardTitle>
              <CardDescription className='text-center'>
                This is todos to help you manage and prioritize you taks.{' '}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  className='flex items-center gap-5'
                  onSubmit={form.handleSubmit(handleOnSubmit)}
                >
                  <FormField
                    control={form.control}
                    name='todos'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Todos :</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='add your todos...'
                            {...field}
                            value={value}
                            onChange={(e: any) => setValue(e.target.value)}
                            className='w-[50vw]'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className='mt-8'>
                    <Button
                      type='submit'
                      onClick={() =>
                        toast(`${value}`, {
                          description: 'Has been created',
                        })
                      }
                      disabled={!value}
                    >
                      <Plus />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardContent>
              <DataTable columns={columns} data={todos} />
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
