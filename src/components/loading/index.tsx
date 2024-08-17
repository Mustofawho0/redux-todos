'use client';
import { useEffect } from 'react';
import { tailChase } from 'ldrs';

const Loading = () => {
  useEffect(() => {
    tailChase.register();
  }, []);

  return (
    <div className='flex items-center justify-center'>
      <l-tail-chase size='60' speed='2.0' color='black'></l-tail-chase>
    </div>
  );
};

export default Loading;
