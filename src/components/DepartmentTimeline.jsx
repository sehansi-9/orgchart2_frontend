import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, TextField, Button, Typography } from '@mui/material';

const dummyData = [
  { year: 2020, ministry: 'Ministry of Health', department: 'Department of Elderly Care' },
  { year: 2021, ministry: 'Ministry of Welfare', department: 'Department of Elderly Care' },
  { year: 2023, ministry: 'Ministry of Social Affairs', department: 'Department of Elderly Care' },
];

const ministryPositions = {
  'Ministry of Health': 3,
  'Ministry of Welfare': 2,
  'Ministry of Social Affairs': 1,
};

const DepartmentTimeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    const filtered = dummyData.filter(
      (item) => item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const chartData = filteredData.map((item) => ({
    year: item.year,
    position: ministryPositions[item.ministry],
    ministry: item.ministry,
  }));

  return (
    <Box
      sx={{
        height: '90vh',
        width: '90vw',
        backgroundColor: '#1e1e1e',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: 3,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Department Movement Timeline
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Department"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: 'white',
            color: 'black',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          Search
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <XAxis
                dataKey="year"
                type="number"
                domain={[2020, 2024]}
                tickCount={5}
                label={{ value: 'Year', position: 'top', fill: 'white' }}
                orientation="top"
                stroke="white"
                tick={{ fill: 'white' }}
              />
              <YAxis
                type="number"
                domain={[0, 4]}
                tickFormatter={(value) => {
                  const ministry = Object.entries(ministryPositions).find(
                    ([_, pos]) => pos === value
                  )?.[0];
                  return ministry || '';
                }}
                label={{
                  value: 'Ministry',
                  angle: -90,
                  position: 'left',
                  offset: 60,
                  fill: 'white',
                }}
                stroke="white"
                tick={{ fill: 'white' }}
              />
              <Tooltip
                formatter={(value, name, props) => [
                  props.payload.ministry,
                  'Ministry',
                ]}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{
                  backgroundColor: '#1e1e1e',
                  border: '1px solid rgba(255, 255, 255, 0.23)',
                  color: 'white',
                }}
              />
              <Line
                type="monotone"
                dataKey="position"
                stroke="white"
                strokeWidth={2}
                dot={{ r: 6, fill: 'white' }}
                activeDot={{ r: 8, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography
            variant="body1"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 4 }}
          >
            Search for a department to see its timeline
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DepartmentTimeline;
