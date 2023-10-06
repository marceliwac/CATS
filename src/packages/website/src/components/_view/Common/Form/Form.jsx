import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

export default function Form(props) {
  const { children, onSubmit } = props;
  const form = useForm({
    mode: 'onTouched',
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
