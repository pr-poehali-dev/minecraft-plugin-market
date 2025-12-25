import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  },
  {
    id: 4,
    title: 'Advanced Anticheat',
    description: 'Надёжная защита от читеров с машинным обучением',
    author: 'SecurityPro',
    type: 'paid',
    access: 'ultimate',
    price: 2000,
    rating: 4.9,
    downloads: 3421,
    minecraftVersion: '1.20',
    image: '/placeholder.svg',
    isNew: true
  },
  {
    id: 5,
    title: 'Quest Manager',
    description: 'Система квестов с визуальным редактором',
    author: 'QuestDev',
    type: 'free',
    access: 'premium',
    rating: 4.3,
    downloads: 2134,
    minecraftVersion: '1.16',
    image: '/placeholder.svg'
  },
  {
    id: 6,
    title: 'Custom Mobs+',
    description: 'Создавайте своих уникальных мобов с уникальными способностями',
    author: 'MobCreator',
    type: 'paid',
    access: 'premium',
    price: 1200,
    rating: 4.6,
    downloads: 1567,
    minecraftVersion: '1.20',
    image: '/placeholder.svg'
  }
];

function Index() {
  const [currentUser] = useState<{ name: string; role: UserRole; avatar: string }>({
    name: 'Player_2024',
    role: 'premium',
    avatar: '/placeholder.svg'
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('catalog');

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

  const filteredResources = mockResources.filter(resource => {
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
            
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveTab('catalog')}>
                <Icon name="Package" size={18} className="mr-2" />
                Каталог
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                <Icon name="User" size={18} className="mr-2" />
                Профиль
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('purchases')}>
                <Icon name="ShoppingBag" size={18} className="mr-2" />
                Покупки
              </Button>
              {currentUser.role === 'ultimate' && (
                <Button variant="ghost" onClick={() => setActiveTab('admin')}>
                  <Icon name="Shield" size={18} className="mr-2" />
                  Админ
                </Button>
              )}
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
                  className={`hover-scale overflow-hidden border-border/50 backdrop-blur-sm ${
                    resource.isNew ? 'animate-pulse-glow' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
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
                        <span className="font-semibold">{resource.rating}</span>
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
                          <Button className="flex-1 gradient-primary">
                            <Icon name="ShoppingCart" size={16} className="mr-2" />
                            {resource.price}₽
                          </Button>
                        )}
                        {resource.type === 'free' && (
                          <Button className="flex-1 bg-green-600 hover:bg-green-700">
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
                    <Button variant="outline" size="icon">
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
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Загружено ресурсов</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <Icon name="Download" size={32} className="mx-auto mb-2 text-gaming-blue" />
                      <div className="text-3xl font-bold">3.2K</div>
                      <div className="text-sm text-muted-foreground">Скачиваний</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6 text-center">
                      <Icon name="Star" size={32} className="mx-auto mb-2 text-yellow-500" />
                      <div className="text-3xl font-bold">4.7</div>
                      <div className="text-sm text-muted-foreground">Средний рейтинг</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Преимущества {getRoleBadge(currentUser.role).label}</h3>
                  <ul className="space-y-2">
                    {currentUser.role === 'free' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Доступ к бесплатным ресурсам</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="X" size={18} className="text-red-500" />
                          <span>Платные ресурсы недоступны</span>
                        </li>
                      </>
                    )}
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
                    {currentUser.role === 'ultimate' && (
                      <>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Доступ ко ВСЕМ ресурсам</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Скидка 50% на платные плагины</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Админ-панель модератора</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="Check" size={18} className="text-green-500" />
                          <span>Эксклюзивный бейдж</span>
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

        {activeTab === 'purchases' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">Мои покупки</CardTitle>
                <CardDescription>История приобретённых ресурсов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockResources.filter(r => r.type === 'paid').slice(0, 3).map(resource => (
                    <div key={resource.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <img src={resource.image} alt={resource.title} className="w-16 h-16 rounded-md object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.author}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{resource.price}₽</div>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Icon name="Download" size={14} className="mr-1" />
                          Скачать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admin' && currentUser.role === 'ultimate' && (
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <Card className="border-border/50 border-gaming-orange">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Shield" size={24} className="text-gaming-orange" />
                  Админ-панель
                </CardTitle>
                <CardDescription>Модерация и управление пользователями</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="resources">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="resources">Ресурсы</TabsTrigger>
                    <TabsTrigger value="users">Пользователи</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resources" className="space-y-4 mt-4">
                    {mockResources.map(resource => (
                      <div key={resource.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <img src={resource.image} alt={resource.title} className="w-16 h-16 rounded-md object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.author}</p>
                        </div>
                        <Button size="sm" variant="destructive">
                          <Icon name="Trash2" size={14} className="mr-1" />
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="users" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      {['User123', 'ProGamer', 'BuilderX'].map((username, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{username}</div>
                              <div className="text-sm text-muted-foreground">Роль: Free</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-gaming-purple/20">
                              Выдать Premium
                            </Button>
                            <Button size="sm" variant="outline" className="bg-gaming-orange/20">
                              Выдать Ultimate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Button variant="ghost" size="sm">
              <Icon name="FileText" size={16} className="mr-2" />
              Правила
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="HelpCircle" size={16} className="mr-2" />
              Поддержка
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Send" size={16} className="mr-2" />
              @nighttimes_owner
            </Button>
          </div>
          <p className="text-sm">© 2024 MineCraft Hub. Платформа для плагинов и сборок</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;
