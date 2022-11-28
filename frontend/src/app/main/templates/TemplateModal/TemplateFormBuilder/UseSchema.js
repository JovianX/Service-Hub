import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCharts } from 'app/store/chartsSlice';

const TYPE_VALUES = ['helm_chart'];
const versions = ['14.0.1', '2.4.2'];

export const UseSchema = () => {
  const [charts, setCharts] = useState(['airflow', 'bitnami']);

  const chartData = useSelector(selectCharts);

  useEffect(() => {
    if (chartData.length) {
      const chartsName = [];
      chartData.forEach((item) => {
        chartsName.push(item.application_name);
      });
      setCharts(chartsName);
    }
  }, [chartData]);

  const schema = {
    definitions: {
      chart: {
        type: 'string',
        enum: charts,
        default: '',
      },
      type: {
        type: 'string',
        enum: TYPE_VALUES,
        default: '',
      },
      version: {
        type: 'string',
        enum: versions,
      },
    },
    title: 'A rather large form',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        required: true,
      },
      type: {
        $ref: '#/definitions/type',
        title: 'Type',
        required: true,
      },
      chart: {
        $ref: '#/definitions/chart',
        title: 'Chart',
        required: true,
      },
      version: {
        $ref: '#/definitions/version',
        title: 'Version',
        required: false,
      },
      key: {
        type: 'string',
        title: 'Key',
        required: false,
      },
      value: {
        type: 'string',
        title: 'Value',
        required: false,
      },
    },
  };

  return schema;
};
