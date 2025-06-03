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
  {
    department: 'Geological Survey and Mines Bureau',
    movements: [
      { year: 2010, ministry: 'Ministry of Environment' },
      { year: 2013, ministry: 'Ministry of Environment & Renewable Energy' },
      { year: 2015, ministry: 'Ministry of Mahaweli Development & Environment' },
      { year: 2018, ministry: 'Ministry of Mahaweli Development & Environment' },
      { year: 2019, ministry: 'Minister of Environment and Wildlife Resources' },
      { year: 2020, ministry: 'Ministry of Environment' },
    ],
  },
  {
    department: 'National Oceanic Affairs Committee Secretariat',
    movements: [
      { year: 2015, ministry: 'Ministry of Foreign Affairs' },
      { year: 2019, ministry: 'Ministry of Foreign Relations' },
      { year: 2020, ministry: 'Foreign Ministry' },
      { year: 2022, ministry: 'Ministry of Foreign Affairs' },
    ],
  },
  {
    department: 'Tax Appeals Commission',
    movements: [
      { year: 2015, ministry: 'Ministry of Finance' },
      { year: 2017, ministry: 'Ministry of Finance and Mass Media' },
      { year: 2018, ministry: 'Ministry of Finance and Mass Media' },
      { year: 2022, ministry: 'Minister of finance, Economic Stabilization and National Policies' },
    ],
  },
];

const getMinistryPositions = (movements) => {
  const ministryEarliestYear = {};

  movements.forEach((m) => {
    if (
      !ministryEarliestYear[m.ministry] ||
      m.year < ministryEarliestYear[m.ministry]
    ) {
      ministryEarliestYear[m.ministry] = m.year;
    }
  });

  const sorted = Object.entries(ministryEarliestYear)
    .sort((a, b) => a[1] - b[1]); // Sort by earliest year (ASC)

  // Assign max position to earliest year (inverted)
  const maxPosition = sorted.length;

  return sorted.reduce((acc, [ministry], index) => {
    acc[ministry] = maxPosition - index; // Invert index to give highest position to earliest
    return acc;
  }, {});
};


const DepartmentTimeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [ministryPositions, setMinistryPositions] = useState({});
  const [department, setDepartment] = useState("");

  const handleSearch = () => {
    const matched = dummyData.find((item) =>
      item.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (matched) {
      setFilteredMovements(matched.movements);
      setMinistryPositions(getMinistryPositions(matched.movements));
      setDepartment(matched.department);
    } else {
      setFilteredMovements([]);
      setMinistryPositions({});
      setDepartment("No department found");
    }
  };


  const chartData = filteredMovements.map((m) => ({
    year: m.year,
    ministry: m.ministry,
    position: ministryPositions[m.ministry],
  }));

  return (
    <Box
      sx={{
        height: '90vh',
        width: '90vw',
        backgroundColor: '#121212',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: 4,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Department Movement Timeline
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>

        <TextField
          label="Search Department"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            input: { color: 'white' },
            label: { color: 'rgba(255,255,255,0.6)' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.4)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
        />


        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            minWidth: 120,
            height: '40px',
            fontWeight: 600,
            backgroundColor: '#ffffff',
            color: '#000',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          Search
        </Button>
      </Box>

      {department && (
        <Typography variant="h6" sx={{ mb: 2, color: '#90caf9' }}>
          Department: {department}
        </Typography>
      )}
{filteredMovements.length > 0 && (
   <Box
  sx={{
    flexGrow: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 2,
    p: 2,
    display: 'flex',
    alignItems: 'stretch',
    height: Math.max(200, 100 * Object.keys(ministryPositions).length) + 40,
  }}
>
  {/* Fixed Y axis */}
  <Box
    sx={{
      flexShrink: 0,
      width: 200,
      height: '100%',
    }}
  >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 50, right: 0, left: 0, bottom: 40 }}
      >
        <YAxis
          type="number"
          domain={[1, Object.keys(ministryPositions).length + 1]}
          ticks={Object.values(ministryPositions)}
          tickFormatter={(value) => {
            const ministry = Object.entries(ministryPositions).find(
              ([_, pos]) => pos === value
            )?.[0];
            return ministry || '';
          }}
          label={{
            value: 'Ministry',
            angle: -90,
            position: 'insideLeft',
            offset: 6,
            fill: 'white',
          }}
          stroke="white"
          tick={{ fill: 'white', fontSize: 13 }}
          width={200}
        />
      </LineChart>
    </ResponsiveContainer>
  </Box>

  {/* Scrollable chart: X axis + line + hidden Y axis */}
  <Box
    sx={{
      overflowX: 'auto',
      overflowY: 'hidden',
      flexGrow: 1,
      height: '100%',
    }}
  >
    <div style={{ minWidth: filteredMovements.length * 80, height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <XAxis
            dataKey="year"
            type="category"
            ticks={filteredMovements.map((m) => m.year)}
            tickCount={5}
            label={{ value: 'Year', position: 'top', fill: 'white' }}
            orientation="top"
            padding={{ left: 20, right: 20 }}
            stroke="white"
            tick={{ fill: 'white', fontSize: 13 }}
          />

          {/* Hidden Y axis with exact same domain and ticks */}
          <YAxis
            type="number"
            domain={[1, Object.keys(ministryPositions).length + 1]}
            ticks={Object.values(ministryPositions)}
            hide={true} // Hide so it doesn't show again but needed for scaling
          />

          <Tooltip
            formatter={(value, name, props) => [
              props.payload.ministry,
              'Ministry',
            ]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{
              backgroundColor: '#2c2c2c',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 6,
              color: 'white',
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke="#90caf9"
            strokeWidth={3}
            dot={{ r: 6, fill: '#90caf9' }}
            activeDot={{ r: 8, fill: '#ffca28' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Box>
</Box>
)}
    </Box>
  );
};

export default DepartmentTimeline;
