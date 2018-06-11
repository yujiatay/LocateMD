import React from 'react';

import { Table } from 'antd';

const columns = [{
  title: 'Date',
  dataIndex: 'date',
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  defaultSortOrder: 'ascend',
  sorter: (a, b) => ("" + a).localeCompare(b.date),
}, {
  title: 'Patient',
  dataIndex: 'patient',
  defaultSortOrder: 'descend',
  // sorter: (a, b) => a.age - b.age,
}];

const AppointmentTable = ({ data, onChange }) => (
  <div>
    <Table columns={columns} dataSource={data} onChange={onChange} />
  </div>
);

export default AppointmentTable;
