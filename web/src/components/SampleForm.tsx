/**
 * TODO: Implement sample form + client/server validation parity
 * Fields: sampleId, collectionDate, sampleType, priority
 * Submit to /api/samples; show field-level errors from API.
 */
import React, { useState }  from 'react';
import { Form, Input, Select, DatePicker, Button, message, Card } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface SampleFormData {
  sampleId: string;
  collectionDate: string;
  sampleType: string;
  priority: string;
}

export const SampleForm: React.FC = () => {const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Client-side validation rules
  const validateSampleId = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Sample ID is required'));
    }
    
    // Pattern: ^[A-Z]-\d{3,5}$
    const pattern = /^[A-Z]-\d{3,5}$/;
    if (!pattern.test(value)) {
      return Promise.reject(new Error('Sample ID must be format: A-123 (letter-dash-3to5digits)'));
    }
    
    return Promise.resolve();
  };

  const validateCollectionDate = (_: any, value: dayjs.Dayjs) => {
    if (!value) {
      return Promise.reject(new Error('Collection date is required'));
    }
    
    if (value.isAfter(dayjs(), 'day')) {
      return Promise.reject(new Error('Collection date cannot be in the future'));
    }
    
    return Promise.resolve();
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      const formData: SampleFormData = {
        sampleId: values.sampleId,
        collectionDate: values.collectionDate.format('YYYY-MM-DD'),
        sampleType: values.sampleType,
        priority: values.priority,
      };

      const response = await fetch('/api/samples', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        message.success('Sample submitted successfully!');
        form.resetFields();
      } else {
        // Map server field errors into Form via form.setFields(...)
        if (result.details && typeof result.details === 'object') {
          const fieldErrors = Object.entries(result.details).map(([field, error]) => ({
            name: field,
            errors: [error as string],
          }));
          
          form.setFields(fieldErrors);
        } else {
          message.error(result.message || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      message.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      <Card title="Sample Submission Form">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label="Sample ID"
            name="sampleId"
            rules={[{ validator: validateSampleId }]}
            help="Format: A-123 (letter-dash-3to5digits)"
          >
            <Input
              placeholder="e.g., A-123, B-12345"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            label="Collection Date"
            name="collectionDate"
            rules={[{ validator: validateCollectionDate }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select collection date"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Sample Type"
            name="sampleType"
            rules={[{ required: true, message: 'Please select a sample type' }]}
          >
            <Select placeholder="Select sample type">
              <Option value="blood">Blood</Option>
              <Option value="urine">Urine</Option>
              <Option value="saliva">Saliva</Option>
              <Option value="tissue">Tissue</Option>
              <Option value="water">Water</Option>
              <Option value="soil">Soil</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority level' }]}
          >
            <Select placeholder="Select priority level">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="urgent">Urgent</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              icon={<SendOutlined />}
              block
            >
              {loading ? 'Submitting...' : 'Submit Sample'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SampleForm;
