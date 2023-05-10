import React, { useEffect, useRef, useState } from 'react'
import { Text, Button, Input, Group, Card, Select, Label } from '@shared/components'
import { FaRegCompass, FaSearch } from 'react-icons/fa'
import { Event } from '@shared/database'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc'
import { Formik } from 'formik'
import * as Yup from 'yup'

interface Option {
  name: string;
  value: any;
}

interface FormOptions {
  circuits: Option[];
  seasons: Option[];
}



const Compass = () => {
  const router = useRouter();
  const formik = useRef(null);
  const { data } = trpc.feature.compass.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const [formOptions, setFormOptions] = useState<FormOptions>({
    circuits: [],
    seasons: []
  });

  useEffect(() => {
    // @ts-ignore
    let { event, circuit: selectedCircuit, season } = formik.current?.values;
    if (formik.current && data && event) {
      const circuits = data[event as Event].map(circuit => ({
        name: circuit.name,
        value: circuit.id
      }));

      const seasons = data[event as Event]
        .filter(circuit => circuit.id === selectedCircuit)[0].seasons
        .map(season => ({
          name: season.id.toString(),
          value: season.id
        }));

      setFormOptions({
        circuits,
        seasons
      });
    }
  }, [formik, data]);

  return (
    <Card
      icon={<FaRegCompass />}
      title="Compass"
      theme="text-sky-400"
      className="min-w-full md:min-w-[300px] max-w-[800px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-sky-400/70 dark:shadow-sky-400/50 p-2"
    >
      <Formik
        innerRef={formik}
        initialValues={{
          event: 'PublicForum',
          circuit: 40,
          season: 2023,
          query: ''
        }}
        validationSchema={
          Yup.object().shape({
            event: Yup
              .string()
              .required("An event is required."),
            circuit: Yup
              .number()
              .required("A circuit is required."),
            season: Yup
              .number()
              .required("A season is required."),
            query: Yup
              .string()
              .optional()
          })
        }
        onSubmit={async (values) => {
          router.push({
            pathname: values.query ? '/search' : '/dataset',
            query: {
              circuit: values.circuit,
              season: values.season,
              ...(values.query && { query: values.query })
            }
          })
        }}
      >
        {
          (props) => (
            <form onSubmit={props.handleSubmit} className="space-y-2">
              <Group character="1" legend="Select a dataset" className="flex flex-col items-center space-y-3 w-full">
                <div className="flex flex-col space-y-3 px-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-around w-full">
                  <Select
                    name="event"
                    options={
                      data
                        ? Object.keys(data).map(event => ({
                          name: (event.match(/[A-Z][a-z]+|[0-9]+/g) as string[]).join(" "),
                          value: event
                        }))
                        : []
                    }
                    handleChange={props.handleChange}
                    label={<Label character="a">Event</Label>}
                  />
                  <Select
                    name="circuit"
                    options={formOptions.circuits}
                    handleChange={props.handleChange}
                    label={<Label character="b">Circuit</Label>}
                  />
                  <Select
                    name="season"
                    options={formOptions.seasons}
                    handleChange={props.handleChange}
                    label={<Label character="c">Season</Label>}
                  />
                </div>
              </Group>
              <Group character="2" legend="Get your results" className="flex flex-col sm:flex-row items-center justify-center space-y-3 w-full">
                <div className="flex w-full justify-between px-5">
                  <Input
                    name="query"
                    onChange={props.handleChange}
                    placeholder='eg. "John Doe" or "Blake AB"'
                    className="w-full"
                  />
                  <Button type="submit" icon={<FaSearch />} _type="primary" className="w-8 h-8 !mx-0 !-ml-8" />
                </div>
                <p className="px-1 text-red-400 border-red-400 border rounded-full !mt-0">OR</p>
                <Button
                  type="submit"
                  _type="primary"
                  className="w-64 text-sm !mt-0"
                  disabled={props.values.query !== ''}
                >
                  View Dataset
                </Button>
              </Group>
            </form>
          )
        }
      </Formik>
    </Card>
  )
}

export default Compass
