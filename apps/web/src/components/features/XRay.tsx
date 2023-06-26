import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Text,
  Button,
  Input,
  Group,
  Card,
  Select,
  Label,
} from "@shared/components";
import { Event } from "@shared/database";
import { useRouter } from "next/router";
import { trpc } from "@src/utils/trpc";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import TeamCombobox, { TeamComboboxValue } from "./TeamCombobox";
import { RiBodyScanLine } from "react-icons/ri";

interface Option {
  name: string;
  value: any;
}

interface FormOptions {
  circuits: Option[];
  seasons: Option[];
}

interface RefreshOptions {
  event?: Event;
  circuit?: number;
}

const XRay = () => {
  const router = useRouter();
  const formikRef = useRef<
    FormikProps<{
      event: string;
      circuit: number;
      season: number;
    }>
  >(null);
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
    seasons: [],
  });
  const [team1Value, setTeam1Value] = useState<TeamComboboxValue | undefined>();
  const [team2Value, setTeam2Value] = useState<TeamComboboxValue | undefined>();

  const refreshOptions = useCallback(
    ({ event, circuit }: RefreshOptions) => {
      if (!data || !formikRef.current) return;

      const { setFieldValue, values } = formikRef.current;

      // @ts-ignore
      const { event: _event, circuit: _circuit } = values;

      const eventData = data[event || (_event as Event)];

      const circuits = eventData.map((circuit) => ({
        name: circuit.name,
        value: circuit.id,
      }));

      const seasons = (
        event === _event
          ? eventData.filter(({ id }) => id === (circuit || _circuit))[0]
              .seasons
          : eventData[0].seasons
      ).map((season) => ({
        name: season.id.toString(),
        value: season.id,
      }));

      setFormOptions({
        circuits,
        seasons,
      });

      if (event && event !== _event) {
        setFieldValue("circuit", circuits[0].value);
      }
      if (circuit && circuit !== _circuit) {
        setFieldValue("season", seasons[0].value);
      }
    },
    [data]
  );

  useEffect(() => {
    refreshOptions({});
  }, [refreshOptions]);

  const handleChange = (e: FormEvent) => {
    if (!(e.nativeEvent instanceof InputEvent)) {
      setTeam1Value(undefined);
      setTeam2Value(undefined);
    }
  };

  const TeamSelection = useCallback(() => {
    const formik = formikRef.current;
    if (!formik) return <></>;

    const { values } = formik;
    return (
      <>
        <TeamCombobox
          event={values.event as Event}
          circuit={values.circuit}
          season={values.season}
          selected={team1Value}
          setSelected={setTeam1Value}
        />
        <TeamCombobox
          event={values.event as Event}
          circuit={values.circuit}
          season={values.season}
          selected={team2Value}
          setSelected={setTeam2Value}
        />
      </>
    );
  }, [team1Value, team2Value]);

  return (
    <Card
      icon={<RiBodyScanLine />}
      title="X-Ray"
      theme="text-blue-400"
      className="min-w-full md:min-w-[300px] max-w-[800px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-sky-400/70 dark:shadow-blue-400/50 p-2"
    >
      <Formik
        innerRef={formikRef}
        initialValues={{
          event: "PublicForum",
          circuit: 40,
          season: 2023,
        }}
        validationSchema={Yup.object().shape({
          event: Yup.string().required("An event is required."),
          circuit: Yup.number().required("A circuit is required."),
          season: Yup.number().required("A season is required."),
        })}
        onSubmit={async (values) => {
          if (!team1Value || !team2Value) return;
          router.push({
            pathname: "/x-ray/head-to-head",
            query: {
              ...values,
              team1: team1Value.teamId,
              team2: team2Value.teamId,
            },
          });
        }}
      >
        {(props) => (
          <form
            onSubmit={props.handleSubmit}
            className="space-y-2"
            onChange={handleChange}
          >
            <Group
              character="1"
              legend="Select a dataset"
              className="flex flex-col items-center space-y-3 w-full"
            >
              <div className="flex flex-col space-y-3 px-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-around w-full">
                <Select
                  name="event"
                  options={
                    data
                      ? Object.keys(data).map((event) => ({
                          name: (
                            event.match(/[A-Z][a-z]+|[0-9]+/g) as string[]
                          ).join(" "),
                          value: event,
                        }))
                      : []
                  }
                  value={props.values.event}
                  handleChange={(e: ChangeEvent<any>) => {
                    props.handleChange(e);
                    refreshOptions({ event: e.target.value });
                  }}
                  label={<Label character="a">Event</Label>}
                />
                <Select
                  name="circuit"
                  options={formOptions.circuits}
                  value={props.values.circuit}
                  handleChange={(e: ChangeEvent<any>) => {
                    props.handleChange(e);
                    refreshOptions({ circuit: parseInt(e.target.value) });
                  }}
                  label={<Label character="b">Circuit</Label>}
                />
                <Select
                  name="season"
                  options={formOptions.seasons}
                  value={props.values.season}
                  handleChange={props.handleChange}
                  label={<Label character="c">Season</Label>}
                />
              </div>
            </Group>
            <Group
              character="2"
              legend="Choose Teams"
              className="grid sm:grid-cols-2 gap-2 sm:gap-4 w-full md:w-[95%] px-4 sm:px-8 md:px-0 sm:mx-auto"
            >
              <TeamSelection />
            </Group>
            <Group
              character="3"
              legend="Get your results"
              className="flex justify-center w-full"
            >
              <Button
                type="submit"
                _type="primary"
                className="w-64 text-sm !mt-0"
                disabled={
                  !team1Value ||
                  !team2Value ||
                  team1Value.teamId === team2Value.teamId
                }
              >
                View prediction
              </Button>
            </Group>
          </form>
        )}
      </Formik>
    </Card>
  );
};

export default XRay;
