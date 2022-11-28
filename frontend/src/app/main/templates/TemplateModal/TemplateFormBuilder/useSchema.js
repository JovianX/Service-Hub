import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectCharts } from 'app/store/chartsSlice';

const TYPE_VALUES = ['helm_chart'];
const versions = ['14.0.1', '2.4.2'];

export const useSchema = () => {
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
      },
      type: {
        type: 'string',
        enum: TYPE_VALUES,
      },
      version: {
        type: 'string',
        enum: versions,
      },
    },
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        required: true,
        default: '',
      },
      type: {
        $ref: '#/definitions/type',
        title: 'Type',
        required: true,
        default: '',
      },
      chart: {
        $ref: '#/definitions/chart',
        title: 'Chart',
        required: true,
        default: '',
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
