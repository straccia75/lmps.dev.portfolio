import type { CaseStudy } from "../types";

/* Data engineering case study. Diagram: components/diagrams.tsx ("aviation-pipeline"). */

export const aviationPipeline: CaseStudy = {
  slug: "aviation-pipeline",
  category: "data",
  name: "Aviation Telemetry Pipeline",
  tagline: "Streaming pipeline from a live API to a tested star schema in BigQuery.",
  summary:
    "The pipeline collects the live position of every aircraft reported by the OpenSky Network, streams it through Kafka and Spark into a data lake, and models it in BigQuery with dbt. The output is a set of tested tables for reporting: an aircraft catalogue, daily metrics per aircraft and a list of flights flying outside normal civil limits. The same pattern fits any business that tracks moving assets, such as delivery fleets, vehicles or field sensors.",

  links: [{ label: "View the code on GitHub", href: "https://github.com/straccia75/data-engineering" }],

  card: {
    kicker: "Data engineering · Personal project",
    blurb: "Live aircraft positions, streamed into a cloud data lake and modelled into tested reporting tables.",
    points: [
      "Kafka and Spark streaming into a partitioned Bronze layer",
      "Incremental Silver model in BigQuery with dbt",
      "Star schema in Gold with anomaly detection",
      "19 data quality tests, including airport elevation checks",
    ],
    skills: ["Streaming", "Data Modelling", "Data Quality"],
    tags: ["Python", "Kafka", "Spark", "BigQuery", "dbt"],
  },

  meta: [
    { label: "Role", value: "Sole engineer" },
    { label: "Scope", value: "Ingestion, streaming, data lake, warehouse modelling, data quality" },
    { label: "Status", value: "Running end to end, dashboard in progress" },
  ],

  facts: [
    { value: "3", label: "layers: Bronze, Silver, Gold" },
    { value: "19", label: "data quality tests in dbt" },
    { value: "5,282", label: "airports used to validate ground readings" },
    { value: "15 min", label: "polling interval, within the free API quota" },
  ],

  architecture: {
    title: "From a live API to tested tables",
    diagram: "aviation-pipeline",
    paragraphs: [
      "The streaming part runs locally in Docker. A Python producer polls the OpenSky API and publishes one event per aircraft to a Redpanda topic. Spark Structured Streaming reads the topic and writes the raw payload to Parquet, partitioned by date, with a checkpoint so restarts never lose or duplicate events.",
      "Bronze files are synced to Google Cloud Storage, keeping the date partitions, and BigQuery reads them from there. Everything after that point is SQL managed by dbt: Silver parses and types the raw JSON, Gold reshapes it into a star schema for reporting.",
      "Every dbt build also runs the data quality tests, so a bad batch is visible before anyone reads a report built on it.",
    ],
    stack: [
      { group: "Ingestion", items: ["Python", "requests", "kafka-python"] },
      { group: "Streaming", items: ["Redpanda (Kafka API)", "Spark Structured Streaming", "Docker Compose"] },
      { group: "Storage", items: ["Parquet", "Hive partitioning", "Google Cloud Storage"] },
      { group: "Warehouse", items: ["BigQuery", "dbt", "Standard SQL"] },
    ],
  },

  systemsIntro: "Grouped by stage of the pipeline.",
  groups: [
    {
      name: "Ingestion and streaming",
      description: "Getting raw events into the lake without losing any.",
      systems: [
        {
          id: "producer",
          title: "API producer",
          intro: "Polls the OpenSky API and turns each response into individual events.",
          points: [
            "One Kafka event per aircraft, so downstream consumers process aircraft independently.",
            "Polling every 15 minutes keeps the producer inside the daily credit limit of the free API.",
            "Failed calls are logged and the loop continues, so one bad response does not stop ingestion.",
            "Only record counts are logged, never payloads, to keep memory and logs flat.",
          ],
        },
        {
          id: "bronze",
          title: "Streaming to Bronze",
          intro: "Spark Structured Streaming writes the raw stream to Parquet.",
          points: [
            "The payload is stored untouched as JSON, so a change in the source schema never breaks ingestion and every record can be reprocessed.",
            "Each event gets its broker timestamp and an ingestion date, used as the partition key.",
            "A checkpoint directory tracks offsets: after a restart the stream continues where it stopped.",
          ],
        },
        {
          id: "lake-sync",
          title: "Data lake sync",
          intro: "Uploads Bronze to Google Cloud Storage.",
          points: [
            "Keeps the date partition layout, so BigQuery and Spark can skip days they do not need.",
            "Idempotent: files already in the bucket are skipped, so the job can run on any schedule.",
          ],
        },
      ],
    },
    {
      name: "Warehouse modelling",
      description: "Turning raw JSON into tables people can report on.",
      systems: [
        {
          id: "silver",
          title: "Incremental Silver layer",
          intro: "Parses the raw payload into typed columns, one row per aircraft event.",
          points: [
            "Incremental dbt model with insert_overwrite: each run replaces only the latest day and the day before it.",
            "Events have no natural unique key, so replacing whole day partitions is what makes re-runs safe.",
            "Defensive casting turns malformed sensor values into nulls instead of failing the run.",
          ],
        },
        {
          id: "gold",
          title: "Star schema in Gold",
          intro: "One dimension and two fact tables for reporting.",
          points: [
            "Aircraft dimension with the latest call sign and country per aircraft, deduplicated with a window function.",
            "Daily fact table per aircraft: readings received, highest speed and highest altitude.",
            "Static attributes live only in the dimension, so the fact tables stay narrow and cheaper to scan.",
          ],
        },
        {
          id: "anomalies",
          title: "Anomaly detection",
          intro: "Flags aircraft flying outside normal civil limits, separating sensor noise from real readings.",
          points: [
            "Limits set above normal civil traffic: 380 m/s ground speed (airliners with a strong tailwind reach about 370) and 16,000 m (business jets fly up to about 15,500).",
            "Evaluated per aircraft and day. A single reading above a limit is an isolated spike, two or more are a sustained reading.",
            "Counting readings works the same whether the producer polls every minute or every 15 minutes.",
          ],
        },
      ],
    },
    {
      name: "Data quality",
      description: "Catching bad data before it reaches a report.",
      systems: [
        {
          id: "physics-tests",
          title: "Physical limit tests",
          intro: "Checks every reading against what an aircraft can physically report.",
          points: [
            "Coordinates within range, no negative speeds, altitudes between -300 m and 18,500 m.",
            "Aircraft reported on the ground at take-off speed or above are flagged.",
            "Tests run as warnings: they surface problems without stopping the pipeline.",
          ],
        },
        {
          id: "airport-check",
          title: "Ground altitude against the nearest airport",
          intro: "Replaces a fixed altitude threshold that flagged every aircraft parked at a high airport.",
          points: [
            "Reference table of 5,282 large and medium airports with their elevation, built from the public OurAirports dataset and loaded as a dbt seed.",
            "Each aircraft on the ground is matched to the closest airport within 5 km with BigQuery geography functions.",
            "A reading is flagged when it differs from the airport elevation by more than 300 m, which covers normal changes in air pressure.",
          ],
        },
        {
          id: "model-tests",
          title: "Model tests",
          intro: "Generic dbt tests on the Gold tables.",
          points: [
            "Unique and not-null keys, and every fact row linked to an aircraft in the dimension.",
            "Anomaly categories restricted to the four accepted values.",
          ],
        },
      ],
    },
  ],

  decisions: [
    {
      choice: "Raw JSON in Bronze instead of parsing on ingestion",
      why: "The source can change its format without breaking the stream, and any day can be reprocessed from the original data.",
    },
    {
      choice: "Redpanda instead of Apache Kafka",
      why: "Same Kafka API in a single container with no ZooKeeper, enough for a single-node setup.",
    },
    {
      choice: "Partitioning by ingestion date",
      why: "Spark, Cloud Storage and BigQuery can all skip the days a query does not need, and a single day can be rebuilt on its own.",
    },
    {
      choice: "Replace day partitions instead of merging rows",
      why: "Events have no unique key to merge on. Replacing whole days makes every run safe to repeat and picks up late data.",
    },
    {
      choice: "Airport elevation instead of a fixed altitude threshold",
      why: "A fixed limit flagged every aircraft parked at a high airport. Checking against the real airport removes those false alarms.",
    },
    {
      choice: "Two readings before calling something an anomaly",
      why: "One out-of-range reading is usually sensor noise. Requiring two keeps the anomaly table useful for review.",
    },
  ],

  cta: {
    title: "Need data you can trust?",
    text: "Pipelines, data lakes and warehouse models that turn raw events into tables your team can report on.",
  },
};
