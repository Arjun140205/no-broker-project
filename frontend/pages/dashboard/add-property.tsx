import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  ArrowLeft, 
  Upload, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Maximize, 
  Wifi, 
  Car, 
  Coffee, 
  Shield,
  Plus,
  X,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  type: 'flat' | 'house' | 'pg' | 'villa' | 'studio' | 'office';
  category: 'rent' | 'buy';
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnished: 'furnished' | 'semifurnished' | 'unfurnished';
  amenities: string[];
  images: string[];
}

const AddProperty = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    type: 'flat',
    category: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    furnished: 'unfurnished',
    amenities: [],
    images: [],
  });

  const availableAmenities = [
    'WiFi', 'Parking', 'Security', 'Gym', 'Pool', 'Garden', 'Balcony',
    'Kitchen', 'AC', 'Heating', 'Elevator', 'Laundry', 'Storage'
  ];

  const propertyTypes = [
    { value: 'flat', label: 'Apartment/Flat', icon: Home },
    { value: 'house', label: 'House', icon: Home },
    { value: 'villa', label: 'Villa', icon: Home },
    { value: 'studio', label: 'Studio', icon: Home },
    { value: 'pg', label: 'PG/Hostel', icon: Home },
    { value: 'office', label: 'Office Space', icon: Home },
  ];

  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== 'owner') {
      router.push('/login');
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload these to a cloud storage service
    // For now, we'll create placeholder URLs
    const newImages = Array.from(files).map((file, index) => 
      `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&${index}`
    );

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10) // Max 10 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Property added successfully!');
        router.push('/dashboard/owner');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add property');
      }
    } catch (error) {
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a property title');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a property description');
      return false;
    }
    if (formData.price <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.city.trim()) {
      toast.error('Please enter a city');
      return false;
    }
    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Luxury 2BHK Apartment in Downtown"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your property in detail..."
                    rows={4}
                    className="input-premium resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="input-premium"
                    >
                      <option value="rent">For Rent</option>
                      <option value="buy">For Sale</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (₹{formData.category === 'rent' ? '/month' : ''})
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      placeholder="Enter price"
                      className="input-premium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Property Type & Details</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Property Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {propertyTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleInputChange('type', type.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.type === type.value
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <IconComponent className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('bedrooms', Math.max(0, formData.bedrooms - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center space-x-1 px-3 py-2 border rounded-lg">
                        <Bed className="w-4 h-4" />
                        <span>{formData.bedrooms}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('bedrooms', formData.bedrooms + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bathrooms</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('bathrooms', Math.max(0, formData.bathrooms - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center space-x-1 px-3 py-2 border rounded-lg">
                        <Bath className="w-4 h-4" />
                        <span>{formData.bathrooms}</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('bathrooms', formData.bathrooms + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Area (sq ft)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                        className="input-premium pl-10"
                        placeholder="1000"
                      />
                      <Maximize className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Furnished</label>
                    <select
                      value={formData.furnished}
                      onChange={(e) => handleInputChange('furnished', e.target.value)}
                      className="input-premium"
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semifurnished">Semi-furnished</option>
                      <option value="furnished">Fully Furnished</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Location & Amenities</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      className="input-premium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="Pincode"
                      className="input-premium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location Description</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Near Metro Station, Downtown Area"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-sm ${
                          formData.amenities.includes(amenity)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Property Images</h3>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Upload Property Images</p>
                    <p className="text-sm text-gray-500">
                      Click to select images or drag and drop (Max 10 images)
                    </p>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold gradient-text">
                Add New Property
              </h1>
              <p className="text-muted-foreground">
                Step {currentStep} of 4 - {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'Property Details' :
                  currentStep === 3 ? 'Location & Amenities' :
                  'Images'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <Card className="card-premium">
          <CardContent className="p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep} className="btn-premium">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-premium"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding Property...</span>
                    </div>
                  ) : (
                    'Add Property'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProperty;