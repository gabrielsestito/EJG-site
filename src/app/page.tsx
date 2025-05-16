'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';
import { ShoppingBag, Truck, Shield, Star, ChevronRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigation } from '@/components/Navigation';

// Loading state component for featured products
const ProductSkeleton = () => (
  <div className="w-full p-4 space-y-4">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-1/4" />
  </div>
);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        const data = await response.json();
        setFeaturedProducts(data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center opacity-20"
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-6xl md:text-7xl font-bold mb-8 tracking-tight text-white"
            >
              EJG Cestas Básicas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-2xl md:text-3xl mb-12 font-light text-white"
            >
              Qualidade e variedade para sua família
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Ver Produtos
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Conheça a EJG
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16"
            >
              Por que escolher a EJG?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  title: 'Qualidade Garantida',
                  description: 'Produtos selecionados com rigoroso controle de qualidade',
                  icon: <Shield className="w-12 h-12 text-green-600" />
                },
                {
                  title: 'Entrega Rápida',
                  description: 'Entregamos em toda a região com agilidade',
                  icon: <Truck className="w-12 h-12 text-green-600" />
                },
                {
                  title: 'Melhor Preço',
                  description: 'Preços justos e competitivos para você',
                  icon: <ShoppingBag className="w-12 h-12 text-green-600" />
                },
                {
                  title: 'Satisfação Garantida',
                  description: 'Compromisso com a satisfação dos nossos clientes',
                  icon: <Star className="w-12 h-12 text-green-600" />
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl font-bold"
              >
                Produtos em Destaque
              </motion.h2>
              <Link href="/products">
                <Button variant="ghost" className="text-green-600 hover:text-green-700 group">
                  Ver todos os produtos
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {isLoading
                ? Array(3).fill(null).map((_, index) => <ProductSkeleton key={index} />)
                : featuredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="relative h-64">
                        <Image
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
                        <p className="text-gray-600 mb-6 text-lg line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-3xl font-bold text-green-600">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(Number(product.price))}
                          </p>
                          <Link href={`/products/${product.id}`}>
                            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition-colors duration-300">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16"
            >
              O que nossos clientes dizem
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Maria Silva",
                  role: "Cliente desde 2020",
                  content: "Excelente qualidade dos produtos e atendimento impecável. Sempre recebo minhas cestas básicas com os melhores itens.",
                  rating: 5
                },
                {
                  name: "João Santos",
                  role: "Cliente desde 2021",
                  content: "Preços justos e entrega sempre pontual. Recomendo a todos que buscam qualidade e bom atendimento.",
                  rating: 5
                },
                {
                  name: "Ana Oliveira",
                  role: "Cliente desde 2022",
                  content: "Produtos frescos e de ótima qualidade. A EJG superou todas as minhas expectativas!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-8 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-lg mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-lg">{testimonial.name}</p>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-r from-green-600 to-green-800">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 bg-[url('/background.png')] bg-cover bg-center"
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-8 text-white">Pronto para fazer seu pedido?</h2>
              <p className="text-xl text-white mb-12">Junte-se a milhares de clientes satisfeitos e comece a receber produtos de qualidade em sua casa.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Fazer Pedido
                  </Button>
                </Link>
                <Link href="/contact">
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
} 