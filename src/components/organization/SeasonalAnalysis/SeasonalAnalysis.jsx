import React, { useState, useEffect, useRef, useCallback } from 'react';
import HTTPService from '../../../Service/HTTPService';
import { Card } from 'antd';
import Chart from 'chart.js/auto';

const { Meta } = Card;

const SeasonalAnalysis = () => {
  const [monthlySalesData, setMonthlySalesData] = useState({});
  const [seasonalSalesData, setSeasonalSalesData] = useState({});
  const monthlyChartRef = useRef(null);
  const seasonalChartRef = useRef(null);

  const fetchMonthlySales = useCallback(async () => {
    try {
      const response = await HTTPService.get('analysis/get_monthly_sales/');
      setMonthlySalesData(response.data);
    } catch (error) {
      console.error('Error fetching monthly sales data:', error);
    }
  }, []);

  const fetchSeasonalSales = useCallback(async () => {
    try {
      const response = await HTTPService.get('analysis/get_seasonal_sales/');
      setSeasonalSalesData(response.data);
    } catch (error) {
      console.error('Error fetching seasonal sales data:', error);
    }
  }, []);

  const prepareMonthlyChartData = useCallback(() => {
    const sortedEntries = Object.entries(monthlySalesData).sort(([a], [b]) => new Date(a) - new Date(b));
    const labels = sortedEntries.map(([dateStr]) => new Date(dateStr).toLocaleString('default', { month: 'short' }));
    const values = sortedEntries.map(([, value]) => value);
    return { labels, values };
  }, [monthlySalesData]);

  const prepareSeasonalChartData = useCallback(() => {
    const labels = ['Mar', 'May', 'Jun'];
    const values = labels.map(month => seasonalSalesData[month] || 0);
    return { labels, values };
  }, [seasonalSalesData]);

  const createChart = useCallback((ctx, type, data, options) => {
    if (ctx) {
      return new Chart(ctx, {
        type,
        data,
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => `Sales: $${tooltipItem.raw.toFixed(2)}`,
              },
            },
          },
          scales: {
            x: { title: { display: true, text: 'Month' } },
            y: { 
              title: { display: true, text: 'Sales ($)' },
              beginAtZero: true,
            },
          },
          ...options,
        },
      });
    }
  }, []);

  const drawMonthlySalesChart = useCallback(() => {
    const { labels, values } = prepareMonthlyChartData();
    const ctx = document.getElementById('monthlySalesChart');
    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }
    monthlyChartRef.current = createChart(ctx, 'line', {
      labels,
      datasets: [{
        label: 'Monthly Sales',
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    });
  }, [prepareMonthlyChartData, createChart]);

  const drawSeasonalSalesChart = useCallback(() => {
    const { labels, values } = prepareSeasonalChartData();
    const ctx = document.getElementById('seasonalSalesChart');
    if (seasonalChartRef.current) {
      seasonalChartRef.current.destroy();
    }
    seasonalChartRef.current = createChart(ctx, 'line', {
      labels,
      datasets: [{
        label: 'Seasonal Sales',
        data: values,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }],
    });
  }, [prepareSeasonalChartData, createChart]);

  useEffect(() => {
    fetchMonthlySales();
    fetchSeasonalSales();
  }, [fetchMonthlySales, fetchSeasonalSales]);

  useEffect(() => {
    drawMonthlySalesChart();
    drawSeasonalSalesChart();
  }, [monthlySalesData, seasonalSalesData, drawMonthlySalesChart, drawSeasonalSalesChart]);

  return (
    <div>
      <Card style={{ width: 800, marginBottom: '20px' }}>
        <Meta title="Seasonal Analysis" />
        <div style={{ height: 400 }}>
          <canvas id="seasonalSalesChart"></canvas>
        </div>
      </Card>

      <Card style={{ width: 800 }}>
        <Meta title="Monthly Sales Trends Chart" />
        <div style={{ height: 400 }}>
          <canvas id="monthlySalesChart"></canvas>
        </div>
      </Card>
    </div>
  );
};

export default SeasonalAnalysis;