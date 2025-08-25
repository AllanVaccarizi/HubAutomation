import React, { useState } from 'react';
import {
  MantineProvider,
  AppShell,
  Container,
  Title,
  Text,
  Card,
  Group,
  Badge,
  Button,
  Stack,
  Grid,
  TextInput,
  ScrollArea,
  Paper,
  ActionIcon,
  Divider,
  Anchor,
  Box,
  Center,
  Loader,
  Avatar,
  Notification
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconSend, 
  IconFileText, 
  IconRobot,
  IconUser,
  IconDatabase,
  IconAd,
  IconSeo,
  IconWorldWww
} from '@tabler/icons-react';

// Données des automatisations avec icônes
const automationsData = {
  vectorisation: [
    {
      id: 'vectorisation-ajout',
      title: 'Ajout de documents à la base de données',
      description: 'Vectorisation de documents sur les tables Supabase.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/c1562901-e462-4d0f-9a19-ef76a72d271d/chat',
      pdfGuide: 'https://drive.google.com/file/d/1Xxl4EtbEX9wFQw4HIvAJtapZuLYNIcM7/preview',
      icon: IconDatabase,
      color: 'blue'
    }
  ],
  googleAds: [
    {
      id: 'gads-redaction',
      title: 'Rédaction d\'annonce GADS',
      description: 'Rédaction de titres et descriptions pour les annonces Google Ads.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/896dcc8e-8db1-4703-a32e-cc436ef6dd51/chat',
      pdfGuide: 'https://drive.google.com/file/d/1u2PdePCdz6CbEbWD5fk_IXr2G2mucGGD/preview',
      icon: IconAd,
      color: 'green'
    }
  ],
  seo: [
    {
      id: 'seo-metatag-avec-brief',
      title: 'Rédaction meta tag + brief de rédaction (plan de balisage)',
      description: 'Rédaction des meta tag, h1 et brief de rédaction.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/88a8efaa-7712-49bd-ba94-4bb130719dbe/chat',
      pdfGuide: 'https://drive.google.com/file/d/12M3bGZR2vDbBe5EIcM6C4-1SSxg4kC6u/preview',
      icon: IconSeo,
      color: 'orange'
    },
    {
      id: 'seo-metatag-sans-brief',
      title: 'Rédaction meta tag SANS brief de rédaction (plan de balisage)',
      description: 'Rédaction des meta tag et h1 sans brief de rédaction.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/761fa2ca-c156-41b5-a287-7fc515d8cedf/chat',
      pdfGuide: 'https://drive.google.com/file/d/12M3bGZR2vDbBe5EIcM6C4-1SSxg4kC6u/preview',
      icon: IconSeo,
      color: 'indigo'
    },
    {
      id: 'seo-alt-description',
      title: 'Rédaction alt description',
      description: 'Rédige les alt description des images de votre site WordPress.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/cb9f34cd-dd44-4859-8a12-4f7a20c32237/chat',
      pdfGuide: 'https://drive.google.com/file/d/1Q_I4K07Y9x-kMbpPB9PNH4_4cJC_1pVO/preview',
      icon: IconSeo,
      color: 'lime'
    },
    {
      id: 'seo-redaction-ancres',
      title: 'Rédaction d\'ancres',
      description: 'Cette automation vous permettra d\'analyser votre site et de générer des ancres optimisées pour le maillage interne afin d\'améliorer votre SEO.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/18e73ba2-e043-44bc-9e9c-1e1bc78ac7b9/chat',
      pdfGuide: 'https://drive.google.com/file/d/15md3XHMRylDFmbjDY5qlD6UWn5IwQrNG/preview',
      icon: IconSeo,
      color: 'pink'
    },
    {
      id: 'seo-netlinking',
      title: 'Netlinking',
      description: 'Cette seconde partie vous permettra d\'appliquer le maillage automatique à vos contenus en utilisant les ancres validées de l\'automation de rédaction d\'ancre.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/573f4d21-3efe-499d-9716-883d2933ad22/chat',
      pdfGuide: 'https://drive.google.com/file/d/12wqopUQXdFvs6Ta9r70cFS7Yoj5xLdSD/preview',
      icon: IconSeo,
      color: 'violet'
    },
    {
      id: 'seo-arborescence',
      title: 'Arborescence de site',
      description: 'Réalisation d\'une arborescence de site (sheet) via un scraping des page via l\'url de niveau 0.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/9a4aeebc-9dd5-4248-8349-ebaf7e9bd7ce/chat',
      pdfGuide: 'https://drive.google.com/file/d/1HrYc3kYAQMVATdiMSIr2PwXdC6c13vZO/preview',
      icon: IconSeo,
      color: 'yellow'
    },
    {
      id: 'seo-contenu',
      title: 'Rédaction de contenu (plan de balisage)',
      description: 'Rédige le contenu de vos pages à partir du plan de balisage.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/9a878af7-0cbc-40a6-b4fc-9da45349c103/chat',
      pdfGuide: 'https://drive.google.com/file/d/12qTFNX4u52x3pbF-NBY-0y39W4Vjp_cb/preview',
      icon: IconSeo,
      color: 'teal'
    }
  ],
  scraping: [
    {
      id: 'scraping-pages',
      title: 'Scraping de page internet',
      description: 'Permet de récupérer le contenu de plusieurs pages internet (utile pour la vectorisation).',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/60fcb296-7be1-4d65-a3b0-59a6fe4c43c0/chat',
      pdfGuide: 'https://drive.google.com/file/d/160g9pih1PMzg1LHCJKKrnHBW6rMlEGCY/preview',
      icon: IconWorldWww,
      color: 'purple'
    }
  ],
  gestionProjet: [
    {
      id: 'onboarding-client',
      title: 'Onboarding client',
      description: 'Création des documents sur Google Drive à partir des infos d\'Airtable + Création de la base RAG sur Supabase.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/d5e39d1b-69ae-4a7a-946b-417fd244ea08/chat',
      pdfGuide: 'https://drive.google.com/file/d/1lWcvkDNYVdOAidzVUSkc9IvpTVIS7xI7/preview',
      icon: IconUser,
      color: 'cyan'
    }
  ],
  analyse: [
    {
      id: 'detection-trend',
      title: 'Détection de trend',
      description: 'Fait de la détection de trend sur des sujets via GTrends et GNews.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/630d898d-3103-47f6-b1c1-2444d5f7c5a7/chat',
      pdfGuide: 'https://drive.google.com/file/d/1fadLylKzA08IEjjhfjLsp4q7dyYGQzVY/preview',
      icon: IconUser,
      color: 'grape'
    },
    {
      id: 'agent-veille',
      title: 'Agent veille',
      description: 'Veille automatisée sur les sujets qui vous intéresse.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/9a9867b0-97e2-4551-87e6-e50845475e9f/chat',
      pdfGuide: 'https://drive.google.com/drive/folders/1bVFE9omDMhyK-eY3Jq94jzXus9fJKmUI',
      icon: IconUser,
      color: 'dark'
    }
  ]
};

// Composant Tuile d'automatisation
const AutomationCard = ({ automation, onSelect }) => {
  const IconComponent = automation.icon;
  
  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: 'pointer', height: '100%' }}
      onClick={() => onSelect(automation)}
    >
      <Group justify="flex-start" mb="xs">
        <Avatar color={automation.color} radius="md">
          <IconComponent size={20} />
        </Avatar>
      </Group>

      <Text fw={500} size="lg" mb="xs">
        {automation.title}
      </Text>

      <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
        {automation.description}
      </Text>

      <Group justify="space-between" mt="md">
        <Button variant="light" color={automation.color} fullWidth radius="md">
          Utiliser l'automatisation
        </Button>
      </Group>
    </Card>
  );
};

// Fonction pour convertir les liens markdown en JSX
const parseMarkdownLinks = (text) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Ajouter le texte avant le lien
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    // Ajouter le lien
    parts.push(
      <Anchor 
        key={match.index} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ color: 'inherit', textDecoration: 'underline' }}
      >
        {match[1]}
      </Anchor>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Ajouter le reste du texte
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};
const ChatInterface = ({ automation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { 
      type: 'user', 
      content: inputMessage, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Appel au webhook de l'automatisation
      const response = await fetch(automation.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMessage.content,
          automation: automation.id,
          timestamp: userMessage.timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      const botMessage = { 
        type: 'bot', 
        content: result.text || result.response || result.message || 'Réponse reçue de l\'automatisation', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'appel webhook:', error);
      
      const errorMessage = { 
        type: 'error', 
        content: `❌ Erreur de transmission : Impossible de communiquer avec l'automatisation "${automation.title}". Vérifiez votre connexion ou contactez l'administrateur.`, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card shadow="md" padding={0} radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group>
          <Avatar color={automation.color} radius="sm">
            <IconRobot size={16} />
          </Avatar>
          <div>
            <Text fw={500}>Interface de Chat</Text>
            <Text size="xs" c="dimmed">
              Communiquez avec l'automatisation {automation.title}
            </Text>
          </div>
        </Group>
      </Card.Section>

      <ScrollArea h={400} p="md">
        {messages.length === 0 ? (
          <Center h={300}>
            <Stack align="center">
              <Avatar size="xl" color={automation.color}>
                <IconRobot size={30} />
              </Avatar>
              <Text c="dimmed" ta="center">
                Démarrez une conversation avec l'automatisation
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap="md">
            {messages.map((message, index) => (
              <Group
                key={index}
                justify={message.type === 'user' ? 'flex-end' : 'flex-start'}
                align="flex-start"
              >
                {message.type !== 'user' && (
                  <Avatar size="sm" color={message.type === 'error' ? 'red' : automation.color}>
                    <IconRobot size={12} />
                  </Avatar>
                )}
                <Paper
                  p="xs"
                  radius="md"
                  bg={
                    message.type === 'user' 
                      ? automation.color 
                      : message.type === 'error' 
                      ? 'red.1'
                      : 'gray.1'
                  }
                  c={
                    message.type === 'user' 
                      ? 'white' 
                      : message.type === 'error'
                      ? 'red.8'
                      : 'dark'
                  }
                  maw="70%"
                >
                  <Text size="sm">{parseMarkdownLinks(message.content)}</Text>
                  <Text size="xs" opacity={0.7} mt={2}>
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </Paper>
                {message.type === 'user' && (
                  <Avatar size="sm" color="blue">
                    <IconUser size={12} />
                  </Avatar>
                )}
              </Group>
            ))}
            {isLoading && (
              <Group justify="flex-start" align="flex-start">
                <Avatar size="sm" color={automation.color}>
                  <IconRobot size={12} />
                </Avatar>
                <Paper p="xs" radius="md" bg="gray.1">
                  <Group gap="xs" align="center">
                    <Loader size="xs" />
                    <Text size="sm" c="dimmed">L'automatisation traite votre demande...</Text>
                  </Group>
                </Paper>
              </Group>
            )}
          </Stack>
        )}
      </ScrollArea>

      <Card.Section withBorder inheritPadding py="xs">
        <Group gap="xs">
          <TextInput
            placeholder="Tapez votre message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1 }}
            disabled={isLoading}
          />
          <ActionIcon
            color={automation.color}
            size="lg"
            radius="md"
            variant="filled"
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            <IconSend size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
};

// Page d'accueil
const HomePage = ({ onSelectAutomation }) => {
  const categoryNames = {
    vectorisation: 'Vectorisation',
    googleAds: 'Google Ads',
    seo: 'SEO',
    scraping: 'Scraping',
    gestionProjet: 'Gestion de projet',
    analyse: 'Analyse'
  };

  const categoryIcons = {
    vectorisation: IconDatabase,
    googleAds: IconAd,
    seo: IconSeo,
    scraping: IconWorldWww,
    gestionProjet: IconUser,
    analyse: IconUser
  };

  const categoryColors = {
    vectorisation: 'blue',
    googleAds: 'green',
    seo: 'orange',
    scraping: 'purple',
    gestionProjet: 'cyan',
    analyse: 'grape'
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Box ta="center">
          <Title order={1} size="3rem" mb="md" c="dark">
            Hub d'Automatisations
          </Title>
          <Text size="xl" c="dimmed" maw={600} mx="auto">
            Accédez à toutes vos automatisations internes depuis une interface centralisée moderne et intuitive
          </Text>
        </Box>

        {Object.entries(automationsData).map(([category, automations]) => {
          const IconComponent = categoryIcons[category];
          return (
            <Stack key={category} gap="lg">
              <Group gap="md">
                <Avatar color={categoryColors[category]} size="lg" radius="md">
                  <IconComponent size={24} />
                </Avatar>
                <div>
                  <Title order={2} size="1.8rem">
                    {categoryNames[category]}
                  </Title>
                  <Text c="dimmed">
                    {automations.length} automatisation{automations.length > 1 ? 's' : ''} disponible{automations.length > 1 ? 's' : ''}
                  </Text>
                </div>
              </Group>

              <Grid>
                {automations.map((automation) => (
                  <Grid.Col key={automation.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <AutomationCard
                      automation={automation}
                      onSelect={onSelectAutomation}
                    />
                  </Grid.Col>
                ))}
              </Grid>

              <Divider my="xl" />
            </Stack>
          );
        })}
      </Stack>
    </Container>
  );
};

// Page d'automatisation individuelle
const AutomationPage = ({ automation, onBack }) => {
  const IconComponent = automation.icon;
  
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group style={{ cursor: 'pointer' }} onClick={onBack}>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Text c="dimmed">Retour à l'accueil</Text>
        </Group>

        <Card shadow="lg" padding="xl" radius="md" withBorder>
          <Group mb="md">
            <Avatar size="xl" color={automation.color} radius="md">
              <IconComponent size={30} />
            </Avatar>
            <div>
              <Title order={1} size="2rem" mb="xs">
                {automation.title}
              </Title>
              <Badge color={automation.color} size="lg" variant="light">
                {automation.color.charAt(0).toUpperCase() + automation.color.slice(1)}
              </Badge>
            </div>
          </Group>

          <Text size="lg" c="dimmed" mb="xl" style={{ lineHeight: 1.6 }}>
            {automation.description}
          </Text>

          <Button
            onClick={() => window.open(automation.pdfGuide, '_blank')}
            leftSection={<IconFileText size={16} />}
            color="green"
            variant="filled"
            size="md"
            radius="md"
          >
            Guide d'utilisation (PDF)
          </Button>
        </Card>

        <ChatInterface automation={automation} />
      </Stack>
    </Container>
  );
};

// Composant principal
const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedAutomation, setSelectedAutomation] = useState(null);

  const handleSelectAutomation = (automation) => {
    setSelectedAutomation(automation);
    setCurrentView('automation');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAutomation(null);
  };

  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        headings: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }
      }}
    >
      <AppShell
        padding="md"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh'
        }}
      >
        <Box 
          style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            minHeight: 'calc(100vh - 32px)',
            margin: '16px',
            padding: '0'
          }}
        >
          {currentView === 'home' ? (
            <HomePage onSelectAutomation={handleSelectAutomation} />
          ) : (
            <AutomationPage 
              automation={selectedAutomation} 
              onBack={handleBackToHome}
            />
          )}
        </Box>
      </AppShell>
    </MantineProvider>
  );
};

export default App;