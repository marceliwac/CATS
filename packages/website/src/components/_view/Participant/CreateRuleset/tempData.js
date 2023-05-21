const tempData = {
  attributes: {
    id: '1',
    nodeType: 'RELATION',
    operation: 'OR',
  },
  children: [
    {
      attributes: {
        id: '2',
        nodeType: 'RELATION',
        operation: 'AND',
      },
      children: [
        {
          attributes: {
            id: '3',
            nodeType: 'RULE',
            parameter: 'arterial_bp_systolic',
            operation: '<',
            value: 60,
          },
        },
        {
          attributes: {
            id: '4',
            nodeType: 'RULE',
            parameter: 'ventilator_mode',
            operation: '=',
            value: 'CPAP/PSV',
          },
        },
        {
          attributes: {
            id: '5',
            nodeType: 'RULE',
            parameter: 'ventilator_mode',
            operation: '=',
            value: 'CPAP/PSV',
          },
        },
      ],
    },
    {
      attributes: {
        id: '6',
        nodeType: 'RELATION',
        operation: 'OR',
      },
      children: [
        {
          attributes: {
            id: '7',
            nodeType: 'RELATION',
            operation: 'AND',
          },
          children: [
            {
              attributes: {
                id: '8',
                nodeType: 'RULE',
                parameter: 'tidal_volume_set',
                operation: '>',
                value: 4,
              },
            },
            {
              attributes: {
                id: '9',
                nodeType: 'RULE',
                parameter: 'tidal_volume_set',
                operation: '<',
                value: 12,
              },
            },
          ],
        },
        {
          attributes: {
            id: '10',
            nodeType: 'RULE',
            parameter: 'respiratory_rate',
            operation: '<',
            value: 20,
          },
        },
      ],
    },
  ],
};

export default tempData;
