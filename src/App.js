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
      pdfGuide: 'guide-vectorisation-ajout.pdf',
      icon: IconDatabase,
      color: 'blue'
    },
    {
      id: 'vectorisation-suppression',
      title: 'Suppression de document de la base de données',
      description: 'Permet de supprimer un document si vous avez ajouté le mauvais document à la BDD.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/20d94d30-1680-454c-bb9a-c529eefd7856/chat',
      pdfGuide: 'guide-vectorisation-suppression.pdf',
      icon: IconDatabase,
      color: 'red'
    }
  ],
  googleAds: [
    {
      id: 'gads-redaction',
      title: 'Rédaction d\'annonce GADS',
      description: 'Rédaction de titres et descriptions pour les annonces Google Ads.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/896dcc8e-8db1-4703-a32e-cc436ef6dd51/chat',
      pdfGuide: 'guide-gads-redaction.pdf',
      icon: IconAd,
      color: 'green'
    }
  ],
  seo: [
    {
      id: 'seo-metatag',
      title: 'Rédaction meta tag plan de balisage',
      description: 'Rédaction des meta tag, h1 et brief de rédaction.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/88a8efaa-7712-49bd-ba94-4bb130719dbe/chat',
      pdfGuide: 'guide-seo-metatag.pdf',
      icon: IconSeo,
      color: 'orange'
    },
    {
      id: 'seo-arborescence',
      title: 'Arborescence de site',
      description: 'Réalisation d\'une arborescence de site (sheet) via un scraping des page via l\'url de niveau 0.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/9a4aeebc-9dd5-4248-8349-ebaf7e9bd7ce/chat',
      pdfGuide: 'guide-seo-arborescence.pdf',
      icon: IconSeo,
      color: 'yellow'
    },
    {
      id: 'seo-contenu',
      title: 'Rédaction de contenu (plan de balisage)',
      description: 'Rédige le contenu de vos pages à partir du plan de balisage.',
      webhook: 'https://n8n.srv749948.hstgr.cloud/webhook/9a878af7-0cbc-40a6-b4fc-9da45349c103/chat',
      pdfGuide: 'guide-seo-contenu.pdf',
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
      pdfGuide: 'guide-scraping-pages.pdf',
      icon: IconWorldWww,
      color: 'purple'
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
          message: userMessage.content,
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
    scraping: 'Scraping'
  };

  const categoryIcons = {
    vectorisation: IconDatabase,
    googleAds: IconAd,
    seo: IconSeo,
    scraping: IconWorldWww
  };

  const categoryColors = {
    vectorisation: 'blue',
    googleAds: 'green',
    seo: 'orange',
    scraping: 'purple'
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
            component="a"
            href={`/guides/${automation.pdfGuide}`}
            target="_blank"
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