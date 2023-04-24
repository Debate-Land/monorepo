import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { trpc } from '@src/utils/trpc';
import { Button, Input, Text } from '@shared/components';
import { GoIssueOpened } from 'react-icons/go';
import clsx from 'clsx';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const Issue = () => {
  const { isLoading, mutate } = trpc.issue.create.useMutation();

  return (
    <div className="mx-2">
      <Formik
        initialValues={{
          email: '',
          title: '',
          description: ''
        }}
        validationSchema={
          Yup.object().shape({
            email: Yup
              .string()
              .email("Please enter a valid email, e.g. `support@debate.land`.")
              .required("An email is required (for follow-ups on your report only)."),
            title: Yup
              .string()
              .required("A name is required."),
            description: Yup
              .string()
              .min(25, "Please enter a description of at least 25 characters.")
              .required("A description is required.")
          })
        }
        onSubmit={async (values, actions) => {
          mutate({ ...values })
          actions.setStatus("submitted")
        }}
      >
        {
          (props) => {
            return props.status === undefined
              ? (
                <form
                  onSubmit={props.handleSubmit}
                  className={
                    clsx(
                      'bg-luka-200/10 p-3 rounded-xl mt-8 mx-auto max-w-[500px] my-16 flex flex-col space-y-2',
                      { 'animate animate-pulse pointer-events-none': isLoading }
                    )
                  }
                >
                  <Text as="h1" className="text-3xl text-gray-600 dark:text-white mx-auto text-center flex items-center">
                    <GoIssueOpened className="mr-1" /> Report an Issue
                  </Text>
                  <Input
                    type="text"
                    placeholder="john.doe@gmail.com"
                    label="Email"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.email}
                    className="w-full -mb-2"
                    name="email"
                    disabled={isLoading}
                  />
                  {props.errors.email && props.touched.email && <Text className="text-red-400 text-xs">{props.errors.email}</Text>}
                  <Input
                    type="text"
                    placeholder="'Missing 2018 Public Forum TOC' or 'Typo on team page'"
                    label="Title"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.title}
                    className="w-full -mb-2"
                    name="title"
                    disabled={isLoading}
                  />
                  {props.errors.title && props.touched.title && <Text className="text-red-400 text-xs">{props.errors.title}</Text>}
                  <div className="w-full border-b border-dashed border-gray-400/80 dark:border-gray-50/20 h-2" />
                  <Input
                    as="textarea"
                    label="Description"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.description}
                    className="w-full -mb-2 h-[200px] text-start dark:bg-slate-800/90 rounded-lg px-3 py-1"
                    placeholder="Describe the issue, expected behavior, and include any relavent URL's (Tabroom and/or Debate Land links)."
                    name="description"
                    disabled={isLoading}
                  />
                  {props.errors.description && props.touched.description && <Text className="text-red-400 text-xs">{props.errors.description}</Text>}
                  <Button
                    type="submit"
                    _type="primary"
                  >
                    Submit
                  </Button>
                </form>
              )
              : (
                <div className="bg-luka-200/10 p-3 rounded-xl mt-8 mx-auto max-w-[500px] my-16 flex flex-col space-y-2">
                  <Text as="h1" className="text-3xl text-green-500 dark:text-green-300 mx-auto text-center flex items-center">
                    <AiOutlineCheckCircle className="mr-1" /> Thanks for your feedback!
                  </Text>
                  <Text className="text-center">
                    We&apos;ve recieved the report you&apos;ve submitted.
                    After reviewing the details, we&apos;ll add it to our workflow or contact you if we have any questions.
                    Then, we&apos;ll send you a follow-up email when it&apos;s fixed. We appreciate your commitment towards equitable data for debate!
                  </Text>
                </div>
              )
          }
        }
      </Formik>
    </div>
  )
}

export default Issue