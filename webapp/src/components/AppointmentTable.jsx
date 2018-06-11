import React from 'react';

import { Table } from 'antd';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  // specify the condition of filtering result
  // here is that finding the name started with `value`
  sorter: (a, b) => a.name.length - b.name.length,
}, {
  title: 'Age',
  dataIndex: 'age',
  defaultSortOrder: 'descend',
  sorter: (a, b) => a.age - b.age,
}, {
  title: 'Address',
  dataIndex: 'address',
  sorter: (a, b) => a.address.length - b.address.length,
}];

const AppointmentTable = ({ data, onChange }) => (
  <div>
    <Table columns={columns} dataSource={data} onChange={onChange} />
  </div>
);

export default AppointmentTable;
