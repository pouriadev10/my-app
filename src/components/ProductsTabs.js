import React, { useEffect, useState } from 'react';
import { ConfigProvider, Tabs, Card } from 'antd';
import { Row, Col, Button, Switch, Input } from 'antd';
import { SearchOutlined, LinkOutlined, FileTextOutlined, CalculatorOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

import ProductTable from './ProductTable';

const ProductsTabs = () => {
  const [products, setProducts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [providerPrice, setProviderPrice] = useState([]);
  const [error, setError] = useState(null);
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const [search, setSearch] = useState();
  const [searchvalue, setSearchValue] = useState('');
  const [foundedSetId, setFoundedSetId] = useState(null);
  const [foundedProductId, setFoundedProductId] = useState(null);
  const [activeKey, setActiveKey] = useState('1429');



  useEffect(() => {
    fetch('https://dummyjson.com/c/1c70-7ac1-4234-b47d')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products);
        setProviders(data.providers || []);
        setProviderPrice(data.providersPriceDetails || []);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const searchQuery = () => {
    if (products && products.length > 0) {
      const foundSet = products.find(product => product.items?.some(item => item.title === search));
  
      if (foundSet) {
        setSearchValue(foundSet);
  
        const setId = foundSet.id;

        setFoundedSetId(setId)
        setActiveKey(setId.toString());
  
        const supplyProductIds = foundSet.items.find(item => item.supplyProductId).supplyProductId
        

        setFoundedProductId(supplyProductIds)
  
        console.log('Set ID:',setId );
        console.log('Supply Product IDs:', supplyProductIds);
      } else {
        console.log('Product not found');
      }
    }
  };
  
  
  useEffect(() => {
    searchQuery();
  }, [search, products]);


  if (error) {
    return <p>Error: {error}</p>;
  }

  if (products.length === 0) {
    return <p>Loading...</p>;
  }

  const handleSwitchChange = (checked) => {
    console.log('Switch toggled:', checked); 
    setIsSwitchChecked(checked);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(providers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'Products.xlsx');
  };



  return (
    <ConfigProvider direction="rtl">
      <Card title="تایید قیمت" style={{ direction: 'rtl' }}>
        <Row gutter={[16, 16]} align="middle">

          <Col span={4}>
            <span>نیازسنجی: پروژه بهسازی مرکز داده</span>
          </Col>
          <Col span={4}>
            <span>پروفایل: سازمان جغرافیایی نیروهای مسلح</span>
          </Col>
          <Col span={4}>
            <Button icon={<LinkOutlined />}>جزئیات بیشتر</Button>
          </Col>
          <Col span={4}>
            <Button icon={<FileTextOutlined />}>اسناد درخواست</Button>
          </Col>
          <Col span={4}>
            <Button icon={<SearchOutlined />}>گفتگو</Button>
          </Col>


          <Col span={4}>
            <Switch
              checkedChildren="محاسبه مجموع قیمت"
              unCheckedChildren="محاسبه مجموع قیمت"
              checked={isSwitchChecked}
              onChange={handleSwitchChange}
            />

          </Col>

        </Row>
      </Card>
      <Card className="ant-card">
        <Row style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          <label> جستجو کالا :</label>
          <Input
            onChange={(e) => {setSearch(e.target.value)}}
            value={search}
           />
        </Row>
        <Row justify='end'>
          <Col>
            <Button icon={<CalculatorOutlined />} onClick={exportToExcel}>خروجی تیم تامین</Button>
          </Col>
        </Row>
        <Tabs activeKey= {activeKey} onChange={key => setActiveKey(key)} defaultActiveKey= {activeKey}>
          {products.map((product) => (
            <Tabs.TabPane tab={product.title} key={product.id}>
              <ProductTable
                product={product}
                providers={providers}
                providerPrice={providerPrice}
                showCheckboxes={isSwitchChecked}
                searchvalue={searchvalue}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </ConfigProvider>
  );
};

export default ProductsTabs;
