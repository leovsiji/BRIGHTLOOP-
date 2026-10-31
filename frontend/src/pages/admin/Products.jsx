import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Eye
} from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { productsApi } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const Products = () => {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    type: 'SaaS License',
    sellingPrice: '',
    costPrice: '',
    status: 'Active',
    category: 'Software'
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch {
      showNotification({
        type: 'error',
        title: 'Fetch Failed',
        message: 'Could not load products from the API.'
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      sku: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'SaaS License',
      sellingPrice: '',
      costPrice: '',
      status: 'Active',
      category: 'Software'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod, e) => {
    e?.stopPropagation();
    setSelectedProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      sku: prod.sku,
      type: prod.type,
      sellingPrice: prod.sellingPrice,
      costPrice: prod.costPrice,
      status: prod.status,
      category: prod.category || 'Software'
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (prod, e) => {
    e?.stopPropagation();
    setSelectedProduct(prod);
    setIsDeleteOpen(true);
  };

  const handleViewDetail = (prod) => {
    setSelectedProduct(prod);
    setIsDetailOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sellingPrice) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Product name and selling price are required.'
      });
      return;
    }

    try {
      if (selectedProduct) {
        await productsApi.update(selectedProduct.id, {
          ...formData,
          sellingPrice: parseFloat(formData.sellingPrice),
          costPrice: parseFloat(formData.costPrice || 0)
        });
        showNotification({
          type: 'success',
          title: 'Product Updated',
          message: `${formData.name} was successfully updated.`
        });
      } else {
        await productsApi.create({
          ...formData,
          sellingPrice: parseFloat(formData.sellingPrice),
          costPrice: parseFloat(formData.costPrice || 0),
          variants: [
            { id: 'v-def', name: 'Default Tier', seats: 10, price: parseFloat(formData.sellingPrice) }
          ]
        });
        showNotification({
          type: 'success',
          title: 'Product Created',
          message: `${formData.name} has been added to the catalog.`
        });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch {
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'An error occurred while saving the product.'
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await productsApi.delete(selectedProduct.id);
      showNotification({
        type: 'success',
        title: 'Product Removed',
        message: `${selectedProduct.name} has been deleted.`
      });
      setIsDeleteOpen(false);
      loadProducts();
    } catch {
      showNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete product.'
      });
    }
  };

  const columns = [
    {
      header: 'Product Name',
      field: 'name',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1C2]/60 flex items-center justify-center text-amber-800 font-semibold shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-[#172033] block">{val}</span>
            <span className="text-[11px] text-[#64748B] font-mono">{row.sku}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      field: 'type',
      sortable: true,
      render: (val) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FFFDF7] border border-[#EAECEF] text-[#172033]">
          {val}
        </span>
      )
    },
    {
      header: 'Selling Price',
      field: 'sellingPrice',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-[#172033] font-mono">
          ${parseFloat(val).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Cost Price',
      field: 'costPrice',
      sortable: true,
      render: (val) => (
        <span className="text-slate-500 font-mono">
          ${parseFloat(val).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Gross Margin',
      key: 'margin',
      render: (_, row) => {
        const margin = row.sellingPrice > 0
          ? Math.round(((row.sellingPrice - (row.costPrice || 0)) / row.sellingPrice) * 100)
          : 0;
        return (
          <span className="font-semibold text-emerald-600">
            {margin}%
          </span>
        );
      }
    },
    {
      header: 'Subscribers',
      field: 'totalSubscribers',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-[#172033]">
          {(val || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      sortable: true,
      render: (val) => <Badge status={val} size="sm" />
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleViewDetail(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenEdit(row, e)}
            className="p-1 rounded text-slate-400 hover:text-amber-700 hover:bg-amber-50"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleOpenDelete(row, e)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">
            Products Catalog
          </h2>
          <p className="text-xs text-[#64748B]">
            Configure software products, standalone licenses, APIs, and product variants
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={handleOpenAdd}
        >
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        searchPlaceholder="Search product by name, SKU or type..."
        onRowClick={handleViewDetail}
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' }
        ]}
      />

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        description="Enter product details, pricing tiers, and inventory categorization."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit}>
              {selectedProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g. BrightCloud Enterprise Core"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="SKU Code"
              placeholder="e.g. BC-ENT-01"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />

            <Select
              label="Product Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                'SaaS License',
                'Digital Service',
                'API Access',
                'Support Service',
                'Cloud Add-on'
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Selling Price (USD)"
              type="number"
              step="0.01"
              placeholder="199.00"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              required
            />

            <Input
              label="Cost Price (USD)"
              type="number"
              step="0.01"
              placeholder="65.00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={['Active', 'Inactive']}
            />
            <Input
              label="Category"
              placeholder="e.g. Cloud Services"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of software benefits, entitlements and usage limits..."
              className="w-full rounded-lg border border-[#EAECEF] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24]"
            />
          </div>
        </form>
      </Modal>

      {/* Product Detail Drawer / Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedProduct.name}
          description={`SKU: ${selectedProduct.sku} • Category: ${selectedProduct.category || 'Software'}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                iconLeft={Edit2}
                onClick={(e) => {
                  setIsDetailOpen(false);
                  handleOpenEdit(selectedProduct, e);
                }}
              >
                Edit Product
              </Button>
            </>
          }
        >
          <div className="space-y-5 text-xs">
            <p className="text-[#64748B] text-sm leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Selling Price</span>
                <span className="text-base font-bold text-[#172033] font-mono">
                  ${selectedProduct.sellingPrice?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Cost Price</span>
                <span className="text-base font-bold text-slate-500 font-mono">
                  ${selectedProduct.costPrice?.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Active Subscribers</span>
                <span className="text-base font-bold text-[#172033]">
                  {selectedProduct.totalSubscribers?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedProduct.status} size="sm" />
              </div>
            </div>

            {/* Product Variants List */}
            <div>
              <h4 className="font-semibold text-[#172033] mb-2 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Configured Product Variants</span>
              </h4>
              <div className="space-y-2">
                {(selectedProduct.variants || []).map((v) => (
                  <div
                    key={v.id}
                    className="p-3 bg-white border border-[#EAECEF] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium text-[#172033]">{v.name}</span>
                      <span className="text-slate-400 ml-2">({v.seats} seats / capacity)</span>
                    </div>
                    <span className="font-bold text-[#172033] font-mono">
                      ${v.price?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? Any active subscriptions tied to this product will be flagged.`}
        confirmText="Delete Product"
        isDanger={true}
      />
    </div>
  );
};

export default Products;
