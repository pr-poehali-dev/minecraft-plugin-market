import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

type UserRole = 'free' | 'premium' | 'ultimate';
type ResourceType = 'free' | 'paid';
type ResourceAccess = 'all' | 'premium' | 'ultimate';

interface Resource {
  id: number;
  title: string;
  description: string;
  author: string;
  type: ResourceType;
  access: ResourceAccess;
  price?: number;
  rating: number;
  downloads: number;
  minecraftVersion: string;
  image: string;
  isNew?: boolean;
  fileName?: string;
  fileSize?: string;
  uploadDate?: string;
}

const mockResources: Resource[] = [
  {
    id: 1,
    title: 'SuperCore Engine',
    description: 'Мощный core плагин с множеством функций для вашего сервера',
    author: 'NightDev',
    type: 'paid',
    access: 'ultimate',
    price: 1500,
    rating: 4.8,
    downloads: 2543,
    minecraftVersion: '1.20',
    image: '/placeholder.svg',
    isNew: true
  },
  {
    id: 2,
    title: 'Custom Weapons Pack',
    description: 'Набор уникального оружия с крутыми эффектами',
    author: 'ProBuilder',
    type: 'paid',
    access: 'premium',
    price: 800,
    rating: 4.5,
    downloads: 1823,
    minecraftVersion: '1.16',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Economy System',
    description: 'Продвинутая система экономики для сервера',
    author: 'EconMaster',
    type: 'free',
    access: 'all',
    rating: 4.2,
    downloads: 5234,
    minecraftVersion: '1.20',
    image: '/placeholder.svg'
  }
];

function Index() {
  const { toast } = useToast();
  const [currentUser] = useState<{ name: string; role: UserRole; avatar: string }>({
    name: 'Player_2024',
    role: 'premium',
    avatar: '/placeholder.svg'
  });
  
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'free' as ResourceType,
    access: 'all' as ResourceAccess,
    price: '',
    minecraftVersion: '1.20',
    image: null as File | null,
    file: null as File | null
  });
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRoleBadge = (role: UserRole) => {
    const badges = {
      free: { label: 'FREE', className: 'bg-gray-500' },
      premium: { label: 'PREMIUM', className: 'bg-gradient-to-r from-gaming-purple to-gaming-pink' },
      ultimate: { label: 'ULTIMATE', className: 'bg-gradient-to-r from-gaming-orange to-gaming-blue' }
    };
    return badges[role];
  };

  const getAccessBadge = (access: ResourceAccess) => {
    const badges = {
      all: { label: 'Для всех', className: 'bg-green-500' },
      premium: { label: 'Premium', className: 'bg-gaming-purple' },
      ultimate: { label: 'Ultimate', className: 'bg-gaming-orange' }
    };
    return badges[access];
  };

  const canAccess = (resourceAccess: ResourceAccess): boolean => {
    if (resourceAccess === 'all') return true;
    if (currentUser.role === 'ultimate') return true;
    if (currentUser.role === 'premium' && resourceAccess === 'premium') return true;
    return false;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, image: e.target.files[0] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewResource({ ...newResource, file: e.target.files[0] });
    }
  };

  const handleSubmitResource = () => {
    if (!newResource.title || !newResource.description || !newResource.image || !newResource.file) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const imageUrl = URL.createObjectURL(newResource.image);
    const newResourceData: Resource = {
      id: resources.length + 1,
      title: newResource.title,
      description: newResource.description,
      author: currentUser.name,
      type: newResource.type,
      access: newResource.access,
      price: newResource.price ? Number(newResource.price) : undefined,
      rating: 0,
      downloads: 0,
      minecraftVersion: newResource.minecraftVersion,
      image: imageUrl,
      isNew: true,
      fileName: newResource.file.name,
      fileSize: (newResource.file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadDate: new Date().toLocaleDateString('ru-RU')
    };

    setResources([newResourceData, ...resources]);
    setIsAddDialogOpen(false);
    setNewResource({
      title: '',
      description: '',
      type: 'free',
      access: 'all',
      price: '',
      minecraftVersion: '1.20',
      image: null,
      file: null
    });
    
    toast({
      title: 'Успешно!',
      description: 'Ваш ресурс добавлен в каталог'
    });
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVersion = selectedVersion === 'all' || resource.minecraftVersion === selectedVersion;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesVersion && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">⛏️</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient">MineCraft Hub</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" onClick={() => setActiveTab('catalog')}>
                <Icon name="Package" size={18} className="mr-2" />
                Каталог
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                <Icon name="User" size={18} className="mr-2" />
                Профиль
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить ресурс
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Добавить новый ресурс</DialogTitle>
                    <DialogDescription>
                      Загрузите свой плагин или сборку в каталог
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Название *</Label>
                      <Input
                        id="title"
                        placeholder="Например: SuperCore Engine"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание *</Label>
                      <Textarea
                        id="description"
                        placeholder="Опишите возможности вашего ресурса..."
                        rows={4}
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Тип</Label>
                        <Select value={newResource.type} onValueChange={(value: ResourceType) => setNewResource({ ...newResource, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Бесплатный</SelectItem>
                            <SelectItem value="paid">Платный</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Доступ</Label>
                        <Select value={newResource.access} onValueChange={(value: ResourceAccess) => setNewResource({ ...newResource, access: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Для всех</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="ultimate">Ultimate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Версия Minecraft</Label>
                        <Select value={newResource.minecraftVersion} onValueChange={(value) => setNewResource({ ...newResource, minecraftVersion: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1.20">1.20</SelectItem>
                            <SelectItem value="1.16">1.16</SelectItem>
                            <SelectItem value="1.12">1.12</SelectItem>
                            <SelectItem value="1.8">1.8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newResource.type === 'paid' && (
                        <div className="space-y-2">
                          <Label htmlFor="price">Цена (₽)</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="1000"
                            value={newResource.price}
                            onChange={(e) => setNewResource({ ...newResource, price: e.target.value })}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Изображение превью *</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {newResource.image ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(newResource.image)}
                              alt="Preview"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <p className="text-sm text-muted-foreground">{newResource.image.name}</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Icon name="Image" size={48} className="mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Нажмите для выбора изображения</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Файл плагина/сборки *</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {newResource.file ? (
                          <div className="space-y-2">
                            <Icon name="FileArchive" size={48} className="mx-auto text-green-500" />
                            <p className="text-sm font-semibold">{newResource.file.name}</p>
                            <p className="text-xs text-muted-foreground">{(newResource.file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Нажмите для выбора файла (.jar, .zip)</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jar,.zip"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    <Button className="w-full gradient-primary" onClick={handleSubmitResource}>
                      <Icon name="Check" size={18} className="mr-2" />
                      Опубликовать ресурс
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </nav>

            <div className="flex items-center gap-3">
              <Badge className={getRoleBadge(currentUser.role).className}>
                {getRoleBadge(currentUser.role).label}
              </Badge>
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск плагинов и сборок..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Версия MC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все версии</SelectItem>
                    <SelectItem value="1.20">1.20</SelectItem>
                    <SelectItem value="1.16">1.16</SelectItem>
                    <SelectItem value="1.12">1.12</SelectItem>
                    <SelectItem value="1.8">1.8</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="free">Бесплатные</SelectItem>
                    <SelectItem value="paid">Платные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <Card 
                  key={resource.id} 
                  className={`hover-scale overflow-hidden border-border/50 backdrop-blur-sm cursor-pointer ${
                    resource.isNew ? 'animate-pulse-glow' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => {
                    setSelectedResource(resource);
                    setIsDetailDialogOpen(true);
                  }}
                >
                  <div className="relative h-48 bg-gradient-accent overflow-hidden">
                    <img src={resource.image} alt={resource.title} className="w-full h-full object-cover opacity-80" />
                    {resource.isNew && (
                      <Badge className="absolute top-3 right-3 bg-gaming-orange">
                        <Icon name="Sparkles" size={14} className="mr-1" />
                        Новое
                      </Badge>
                    )}
                    <Badge className={`absolute top-3 left-3 ${getAccessBadge(resource.access).className}`}>
                      {getAccessBadge(resource.access).label}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{resource.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        {resource.minecraftVersion}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Icon name="Star" size={16} />
                        <span className="font-semibold">{resource.rating || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Download" size={16} />
                        <span>{resource.downloads}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="User" size={16} />
                      <span>{resource.author}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    {canAccess(resource.access) ? (
                      <>
                        {resource.type === 'paid' && (
                          <Button className="flex-1 gradient-primary" onClick={(e) => e.stopPropagation()}>
                            <Icon name="ShoppingCart" size={16} className="mr-2" />
                            {resource.price}₽
                          </Button>
                        )}
                        {resource.type === 'free' && (
                          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={(e) => e.stopPropagation()}>
                            <Icon name="Download" size={16} className="mr-2" />
                            Скачать
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button className="flex-1 gradient-accent" disabled>
                        <Icon name="Lock" size={16} className="mr-2" />
                        Нужен {resource.access === 'ultimate' ? 'Ultimate' : 'Premium'}
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}>
                      <Icon name="Heart" size={16} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="text-3xl">{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-3xl mb-2">{currentUser.name}</CardTitle>
                    <Badge className={`${getRoleBadge(currentUser.role).className} text-lg px-4 py-1`}>
                      {getRoleBadge(currentUser.role).label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <Icon name="Package" size={32} className="mx-auto mb-2 text-primary" />
                      <div className="text-3xl font-bold">{resources.filter(r => r.author === currentUser.name).length}</div>
                      <div className="text-sm text-muted-foreground">Загружено ресурсов</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <Icon name="Download" size={32} className="mx-auto mb-2 text-gaming-blue" />
                      <div className="text-3xl font-bold">0</div>
                      <div className="text-sm text-muted-foreground">Скачиваний</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <Icon name="Star" size={32} className="mx-auto mb-2 text-yellow-500" />
                      <div className="text-3xl font-bold">—</div>
                      <div className="text-sm text-muted-foreground">Средний рейтинг</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Преимущества {getRoleBadge(currentUser.role).label}</h3>
                  <ul className="space-y-2">
                    {currentUser.role === 'premium' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Доступ ко всем Premium ресурсам</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Скидка 20% на платные плагины</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Приоритетная поддержка</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {currentUser.role !== 'ultimate' && (
                  <div className="pt-4">
                    <Button className="w-full gradient-accent text-lg py-6">
                      <Icon name="Crown" size={20} className="mr-2" />
                      Улучшить подписку
                    </Button>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Свяжитесь с @nighttimes_owner в Telegram
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle className="text-2xl">{selectedResource.title}</DialogTitle>
                    <DialogDescription className="mt-2 text-base">
                      {selectedResource.description}
                    </DialogDescription>
                  </div>
                  <Badge className={getAccessBadge(selectedResource.access).className}>
                    {getAccessBadge(selectedResource.access).label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <img 
                  src={selectedResource.image} 
                  alt={selectedResource.title} 
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Icon name="Star" size={24} className="mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">{selectedResource.rating || '—'}</div>
                    <div className="text-xs text-muted-foreground">Рейтинг</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Icon name="Download" size={24} className="mx-auto mb-2 text-gaming-blue" />
                    <div className="text-2xl font-bold">{selectedResource.downloads}</div>
                    <div className="text-xs text-muted-foreground">Скачиваний</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Icon name="Package" size={24} className="mx-auto mb-2 text-gaming-purple" />
                    <div className="text-2xl font-bold">{selectedResource.minecraftVersion}</div>
                    <div className="text-xs text-muted-foreground">Версия MC</div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Icon name="User" size={24} className="mx-auto mb-2 text-gaming-orange" />
                    <div className="text-lg font-bold">{selectedResource.author}</div>
                    <div className="text-xs text-muted-foreground">Автор</div>
                  </div>
                </div>

                {selectedResource.fileName && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="FileArchive" size={20} />
                      Информация о файле
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Имя файла:</span>
                        <span className="font-mono">{selectedResource.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Размер:</span>
                        <span>{selectedResource.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Загружено:</span>
                        <span>{selectedResource.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {canAccess(selectedResource.access) ? (
                    <>
                      {selectedResource.type === 'paid' && (
                        <Button className="flex-1 gradient-primary" size="lg">
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          Купить за {selectedResource.price}₽
                        </Button>
                      )}
                      {selectedResource.type === 'free' && (
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" size="lg">
                          <Icon name="Download" size={18} className="mr-2" />
                          Скачать бесплатно
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button className="flex-1 gradient-accent" size="lg" disabled>
                      <Icon name="Lock" size={18} className="mr-2" />
                      Нужен {selectedResource.access === 'ultimate' ? 'Ultimate' : 'Premium'}
                    </Button>
                  )}
                  <Button variant="outline" size="lg">
                    <Icon name="Heart" size={18} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Index;
