import { Button, Card, Input } from '@shared/components'
import { trpc } from '@src/utils/trpc';
import { Formik } from 'formik'
import React, { useState } from 'react'
import { AiOutlineArrowRight, AiOutlineMail } from 'react-icons/ai'
import * as Yup from 'yup';

export interface EmailInputProps {
  teamId?: string
}

const EmailInput = (props: EmailInputProps) => {
  const [subscribed, setSubscribed] = useState(false);

  const { mutateAsync: subscribe } = trpc.email.subscribe.useMutation();

  return (
    <>
      <Formik
        initialValues={{
          email: ''
        }}
        validationSchema={
          Yup.object().shape({
            email: Yup.string().email('Please enter a valid email.').required('An email is required')
          })
        }
        onSubmit={async({ email }) => {
          await subscribe({
            email,
            ...props
          });
          setSubscribed(true);
        }}
      >
        {
          !subscribed && ((props) => (
            <div className="max-w-[400px] w-full mx-auto">
              <form className="flex border rounded-l-lg rounded-r-xl border-r-0 dark:border-gray-600">
                <Input
                  name="email"
                  onChange={props.handleChange}
                  placeholder="hi@debate.land"
                  className="w-full"
                />
                <Button
                  type="submit"
                  onClick={props.handleSubmit}
                  icon={<AiOutlineArrowRight />}
                  _type="primary"
                  className="w-8 h-8 !mx-0 !-ml-8"
                />
              </form>
              {
                props.touched.email
                && props.errors.email
                && <p className="text-red-400">{props.errors.email}</p>
              }
            </div>
          ))
        }
      </Formik>
      {
        subscribed && (
          <p className="ml-1 mx-auto w-full text-center text-green-500">You've subscribed for updates!</p>
        )
      }
    </>
  )
}

export default EmailInput