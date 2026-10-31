import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import DataTable from '../../components/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Input from '../../components/common/Input';
import { productsApi, getApiError } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

/**
 * Admin Products page
 *
 * Connected to: GET/POST/PUT/DELETE /api/products/
 *
 * Backend Product model fields:
 *   id, name, description, price, is_active, created_at
 *
 * Fields NOT in backend (rich mock data only — omitted from forms/table):
 *   sku, type, costPrice, category, variants, totalSubscribers
 */
export const Products = () => {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form state — matches backend fields exactly
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    is_active: true
  });
  const [formLoading, setFormLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Fetch Failed',
        message: getApiError(err)
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
    setFormData({ name: '', description: '', price: '', is_active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod, e) => {
    e?.stopPropagation();
    setSelectedProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      is_active: prod.is_active
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
    e?.preventDefault();
    if (!formData.name.trim()) {
      showNotification({ type: 'error', title: 'Validation', message: 'Product name is required.' });
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      showNotification({ type: 'error', title: 'Validation', message: 'A valid price is required.' });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price).toFixed(2),
      is_active: formData.is_active
    };

    setFormLoading(true);
    try {
      if (selectedProduct) {
        await productsApi.update(selectedProduct.id, payload);
        showNotification({ type: 'success', title: 'Product Updated', message: `${payload.name} saved.` });
      } else {
        await productsApi.create(payload);
        showNotification({ type: 'success', title: 'Product Created', message: `${payload.name} added to catalog.` });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      showNotification({ type: 'error', title: 'Save Failed', message: getApiError(err) });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await productsApi.delete(selectedProduct.id);
      showNotification({ type: 'success', title: 'Product Deleted', message: `${selectedProduct.name} removed.` });
      setIsDeleteOpen(false);
      loadProducts();
    } catch (err) {
      showNotification({ type: 'error', title: 'Delete Failed', message: getApiError(err) });
    }
  };

  const columns = [
    {
      header: 'Product Name',
      field: 'name',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1C2]/60 flex items-center justify-center text-amber-800 shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <span className="font-semibold text-[#172033]">{val}</span>
        </div>
      )
    },
    {
      header: 'Price',
      field: 'price',
      sortable: true,
      render: (val) => (
        <span className="font-bold text-[#172033] font-mono">
          ${parseFloat(val).toFixed(2)}
        </span>
      )
    },
    {
      header: 'Status',
      field: 'is_active',
      sortable: true,
      render: (val) => <Badge status={val ? 'active' : 'inactive'} size="sm" />
    },
    {
      header: 'Created',
      field: 'created_at',
      sortable: true,
      render: (val) => (
        <span className="text-slate-500 text-[11px] font-mono">
          {val ? new Date(val).toLocaleDateString() : '—'}
        </span>
      )
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
          <h2 className="text-xl font-bold text-[#172033] tracking-tight">Products Catalog</h2>
          <p className="text-xs text-[#64748B]">
            Manage software products and pricing available for subscription
          </p>
        </div>
        <Button variant="primary" iconLeft={Plus} onClick={handleOpenAdd}>
          Add Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
        searchPlaceholder="Search products by name..."
        onRowClick={handleViewDetail}
        filterOptions={[
          { label: 'Active', value: true },
          { label: 'Inactive', value: false }
        ]}
        filterKey="is_active"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
        description="All fields map directly to the backend Product model."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit} isLoading={formLoading}>
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

          <Input
            label="Price (USD)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="199.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-medium text-[#172033] mb-1.5">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of the product..."
              className="w-full rounded-lg border border-[#EAECEF] bg-white px-3 py-2 text-sm text-[#172033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/50 focus:border-[#FBBF24]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${formData.is_active ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs text-[#172033]">
              {formData.is_active ? 'Active — visible to customers' : 'Inactive — hidden from customers'}
            </span>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedProduct.name}
          description={`Product ID: ${selectedProduct.id}`}
          size="lg"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
              <Button
                variant="primary"
                iconLeft={Edit2}
                onClick={(e) => { setIsDetailOpen(false); handleOpenEdit(selectedProduct, e); }}
              >
                Edit Product
              </Button>
            </>
          }
        >
          <div className="space-y-5 text-xs">
            <p className="text-[#64748B] text-sm leading-relaxed">
              {selectedProduct.description || 'No description provided.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FFFDF7] p-4 rounded-xl border border-[#EAECEF]">
              <div>
                <span className="text-[#64748B] block mb-0.5">Price</span>
                <span className="text-base font-bold text-[#172033] font-mono">
                  ${parseFloat(selectedProduct.price).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Status</span>
                <Badge status={selectedProduct.is_active ? 'active' : 'inactive'} size="sm" />
              </div>
              <div>
                <span className="text-[#64748B] block mb-0.5">Created</span>
                <span className="font-semibold text-[#172033] font-mono">
                  {selectedProduct.created_at
                    ? new Date(selectedProduct.created_at).toLocaleDateString()
                    : '—'}
                </span>
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
        message={`Delete "${selectedProduct?.name}"? Active subscriptions tied to this product may be affected.`}
        confirmText="Delete Product"
        isDanger
      />
    </div>
  );
};

export default Products;
