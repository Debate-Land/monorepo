import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { trpc } from '@src/utils/trpc';
import { Button, Input, Select, Text } from '@shared/components';
import clsx from 'clsx';
import { AiOutlineCheckCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import LINEAR_LABEL_OPTIONS from '@src/const/linear-label-options';
import { VscError } from 'react-icons/vsc';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

const Feedback = () => {
  const router = useRouter();
  const { isLoading, mutateAsync } = trpc.feedback.create.useMutation();

  const SEO_TITLE = 'Feedback — Debate Land';
  const SEO_DESCRIPTION = 'Submit feedback directly to the Debate Land Staff.';

  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: 'website',
          url: `https://debate.land`,
          images: [{
            url: `https://debate.land/api/og?title=${SEO_DESCRIPTION.replace('.', '')}`
          }]
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="mx-2 h-screen flex items-center transition-all">
        <Formik
          initialValues={{
            email: '',
            title: '',
            description: '',
            category: LINEAR_LABEL_OPTIONS[0].value
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
              category: Yup
                .string()
                .min(1, "A category is required")
                .required("A category is required."),
              description: Yup
                .string()
                .min(25, "Please enter a description of at least 25 characters.")
                .required("A description is required.")
            })
          }
          onSubmit={async (values, actions) => {
            const { success } = await mutateAsync({ ...values });
            actions.setStatus({ success });
            await new Promise(resolve => setTimeout(resolve, 10000));
            router.back();
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
                        'bg-luka-200/10 p-3 rounded-xl mt-8 m-auto w-full max-w-[500px] my-16 flex flex-col space-y-2',
                        { 'animate animate-pulse pointer-events-none': isLoading }
                      )
                    }
                  >
                    <Text as="h1" className="text-3xl text-gray-600 dark:text-white mx-auto text-center flex items-center">
                      <AiOutlineInfoCircle className="mr-1" /> Report Feedback
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
                    <Select
                      options={LINEAR_LABEL_OPTIONS}
                      handleChange={props.handleChange}
                      className="!w-full"
                      label="Category"
                      name="category"
                    />
                    {props.errors.category && props.touched.category && <Text className="text-red-400 text-xs">{props.errors.category}</Text>}
                    <div className="w-full border-b border-dashed border-gray-400/80 dark:border-gray-50/20 h-2" />
                    <Input
                      as="textarea"
                      label="Description"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.description}
                      className="w-full -mb-2 h-[200px] text-start dark:bg-slate-800/90 rounded-lg px-3 py-1"
                      placeholder="Describe the issue (if applicable), expected/ideal behavior, and include any relavent URL's (Tabroom and/or Debate Land links)."
                      name="description"
                      disabled={isLoading}
                    />
                    {props.errors.description && props.touched.description && <Text className="text-red-400 text-xs">{props.errors.description}</Text>}
                    <Button
                      type="submit"
                      _type="primary"
                      className="w-48 !mt-4 !mb-1 mx-auto"
                    >
                      Submit
                    </Button>
                  </form>
                )
                : props.status.success
                  ? (
                    <div className="bg-luka-200/10 p-3 rounded-xl mt-8 mx-auto max-w-[500px] my-16 flex flex-col space-y-2">
                      <Text as="h1" className="text-3xl text-green-500 dark:text-green-300 mx-auto text-center flex items-center">
                        <AiOutlineCheckCircle className="mr-1" /> Thanks for your feedback!
                      </Text>
                      <Text className="text-center">
                        We&apos;ve recieved the report you&apos;ve submitted.
                        After reviewing the details, we&apos;ll add it to our workflow or contact you if we have any questions.
                        <br />
                        <br />
                        The Debate Land team appreciates your commitment towards transparent, high-quality data for debate!
                      </Text>
                    </div>
                  )
                  : (
                    <div className="bg-luka-200/10 p-3 rounded-xl mt-8 mx-auto max-w-[500px] my-16 flex flex-col space-y-2">
                      <Text as="h1" className="text-3xl text-red-400 mx-auto text-center flex items-center">
                        <VscError className="mr-1" /> That&apos;s an Error!
                      </Text>
                      <Text className="text-center">
                        Unfortunately, we weren&apos;t able to process your feedback. But, we still want to hear from you!
                        Please <span className="text-indigo-400 underline hover:opacity-80 cursor-pointer" onClick={() => router.push('/contact')}>get in touch</span> via email and we&apos;ll get back to you.
                      </Text>
                    </div>
                  )
            }
          }
        </Formik>
      </div>
    </>
  )
}

export default Feedback