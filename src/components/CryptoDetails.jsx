import React, { useState } from 'react';
import HtmlReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  console.log(coinId)
  const [timePeriod, setTimePeriod] = useState('7d');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });

  console.log(coinHistory)

  const cryptosDetails = data?.data?.coin;
  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptosDetails?.price && millify(cryptosDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptosDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptosDetails?.['24hVolume'] && millify(cryptosDetails?.['24hVolume'])}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptosDetails?.marketCap && millify(cryptosDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${millify(cryptosDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptosDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptosDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Aprroved Supply', value: cryptosDetails?.approvedSupply ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${millify(cryptosDetails?.totalSupply)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${millify(cryptosDetails?.circulatingSupply)}`, icon: <ExclamationCircleOutlined /> },
  ];

  if(isFetching) return 'Loading...';

  return (
    <Col className='coin-detail-container'>
      <Col className='coin-heading-container'>
        <Title level={2} className='coin-name'>
          {cryptosDetails.name} ({cryptosDetails.symbol}) Price
        </Title>
        <p>
          {cryptosDetails.name} live price in US dollars.
          View value statistics, market cap and supply.
        </p>
      </Col>
      <Select 
        defaultValue="7d" 
        className='select-timeperiod' 
        placeholder="Select Time Period"
        onChange={(value) => setTimePeriod(value)}
      >
        {time.map((date) => <Option key={date}>{date}</Option>)}
      </Select>
      {/* <LineChart coinHistory={coinHistory} currentPrice={millify(cryptosDetails.price)} coinName={cryptosDetails.name} /> */}
      <Col className='stats-container'>
          <Col className='coin-value-statistics'>
            <Col className='coin-value-statistics-heading'>
              <Title level={3} className="coin-details-heading">
                {cryptosDetails.name} Value Statistics
              </Title>
              <p>
                  An overview showing the stats of { cryptosDetails.name }
              </p>
            </Col>
            {stats.map(({ icon, title, value }, i) => (
              <Col className='coin-stats' key={i}>
                <Col className='coin-stat-sname'>
                  <Text>{icon}</Text>
                  <Text>{title}</Text>
                </Col>
                <Text className='stats'>{value}</Text>
              </Col>
            ))}
          </Col>
          <Col className='other-stats-info'>
            <Col className='coin-value-statistics-heading'>
              <Title level={3} className="coin-details-heading">
                {cryptosDetails.name} Other Statistics
              </Title>
              <p>
                  An overview showing the stats of all Cryptocurrencies
              </p>
            </Col>
            {genericStats.map(({ icon, title, value }, i) => (
              <Col className='coin-stats' key={i}>
                <Col className='coin-stat-sname'>
                  <Text>{icon}</Text>
                  <Text>{title}</Text>
                </Col>
                <Text className='stats'>{value}</Text>
              </Col>
            ))}
          </Col>
      </Col>
      <Col className='coin-desc-link'>
        <Row className='coin-desc'>
              <Title level={3} className="coin-details-heading">
                What is { cryptosDetails.name }
                {HtmlReactParser(cryptosDetails.description)}
              </Title>
        </Row>
        <Col className='coin-links'>
          <Title level={3} className="coin-details-heading">
            {cryptosDetails.name} Links
            {cryptosDetails.links.map((link) => (
              <Row className='coin-link' key={link.name}>
                <Title level={5} className='link-name'>
                  {link.type}
                </Title>
                <a href={link.url} target="_blank" rel='noreferrer'>
                  {link.name}
                </a>
              </Row>
            ))}
          </Title>
        </Col>
      </Col>
    </Col>
  )
}

export default CryptoDetails