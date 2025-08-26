/**
 * BuscaLogo API Client - WebSocket
 * 
 * Funcionalidades:
 * - Conexão WebSocket como peer
 * - Envio de dados capturados
 * - Sincronização automática
 * - Aparece na lista de peers do BuscaLogo
 */

class BuscaLogoAPIClient {
  constructor(scraper = null) {
    this.ws = null;
    this.peerId = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    // Referência ao scraper para acessar o banco de dados
    this.scraper = scraper;
    
    // Callbacks
    this.onConnect = null;
    this.onDisconnect = null;
    
    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.reconnect = this.reconnect.bind(this);
  }
  
  /**
   * Conecta ao servidor como peer
   */
  async connect() {
    if (this.isConnected) return;
    
    try {
      // Gera ID como peer (não como cliente desktop)
      this.peerId = `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `wss://api.buscalogo.com?peerId=${this.peerId}`;
      
      console.log(`🔗 Conectando como peer: ${url}`);
      
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('✅ Conectado como peer ao BuscaLogo');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Envia mensagem de conexão como peer
        this.sendMessage({
          type: 'PEER_CONNECT',
          peerId: this.peerId,
          capabilities: {
            search: true,
            storage: true,
            scraping: true
          },
          clientType: 'desktop-app',
          timestamp: Date.now()
        });
        
        // Notifica conexão
        if (this.onConnect) {
          this.onConnect();
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Mensagem recebida:', {
            type: message.type,
            data: message.data,
            queryId: message.queryId,
            query: message.query,
            peerId: message.peerId,
            timestamp: message.timestamp,
            fullMessage: message // Mostra a mensagem completa
          });
          
          // Processa mensagens específicas
          this.handleMessage(message);
          
        } catch (error) {
          console.error('❌ Erro ao processar mensagem:', error);
          console.error('📨 Mensagem raw:', event.data);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('🔌 Desconectado do servidor:', event.code);
        this.isConnected = false;
        
        // Notifica desconexão
        if (this.onDisconnect) {
          this.onDisconnect();
        }
        
        // Tenta reconectar
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect();
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ Erro na conexão:', error);
        this.isConnected = false;
      };
      
    } catch (error) {
      console.error('❌ Erro ao conectar:', error);
      this.scheduleReconnect();
    }
  }
  
  /**
   * Processa mensagens recebidas
   */
  handleMessage(message) {
    const { type, data, queryId, query, peerId, timestamp } = message;
    
    switch (type) {
      case 'WELCOME':
        console.log('👋 Servidor enviou boas-vindas:', message.message || data?.message);
        break;
        
      case 'CONNECTION_ESTABLISHED':
        console.log('✅ Conexão estabelecida com servidor');
        break;
        
      case 'SEARCH_REQUEST':
        console.log('🔍 Busca solicitada pelo servidor:', message);
        // Os dados podem estar diretamente na mensagem ou em data
        const searchData = data || { queryId, query, peerId, timestamp };
        this.handleSearchRequest(searchData);
        break;
        
      case 'PONG':
        console.log('🏓 PONG recebido, conexão ativa');
        break;
        
      default:
        console.log('📨 Mensagem não processada:', type);
    }
  }
  
  /**
   * Processa requisição de busca do servidor
   */
  async handleSearchRequest(searchData) {
    try {
      console.log('🔍 Dados de busca recebidos:', searchData);
      
      // Valida se searchData existe e tem as propriedades necessárias
      if (!searchData || typeof searchData !== 'object') {
        console.warn('⚠️ Dados de busca inválidos:', searchData);
        return;
      }
      
      const { queryId, query } = searchData;
      
      // Valida se queryId e query existem
      if (!queryId || !query) {
        console.warn('⚠️ queryId ou query ausentes:', { queryId, query });
        return;
      }
      
      console.log(`🔍 Busca solicitada: "${query}" (${queryId})`);
      
      // Usa o sistema de busca do scraper (igual à extensão)
      const localResults = await this.scraper.searchLocalPages(query);
      console.log(`🔍 Encontrados ${localResults.length} resultados locais`);
      
      // Formata resultados igual à extensão
      const formattedResults = localResults.map(page => ({
        url: page.url,
        title: page.title,
        hostname: page.hostname,
        meta: page.meta,
        headings: page.headings,
        paragraphs: page.paragraphs,
        terms: page.terms,
        score: page.score,
        timestamp: page.timestamp
      }));
      
      // Envia resultados para o servidor
      const response = {
        type: 'SEARCH_RESPONSE',
        queryId: queryId,
        results: formattedResults,
        peerId: this.peerId,
        timestamp: Date.now()
      };
      
      this.sendMessage(response);
      console.log(`📤 Resposta de busca enviada com ${formattedResults.length} resultados`);
      
    } catch (error) {
      console.error('❌ Erro ao processar busca:', error);
      
      // Envia erro para o servidor
      const errorResponse = {
        type: 'SEARCH_RESPONSE',
        queryId: searchData?.queryId,
        error: error.message,
        peerId: this.peerId,
        timestamp: Date.now()
      };
      
      this.sendMessage(errorResponse);
    }
  }
  
  /**
   * Desconecta do servidor
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Desconexão intencional');
      this.ws = null;
    }
    this.isConnected = false;
  }
  
  /**
   * Tenta reconectar
   */
  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Máximo de tentativas de reconexão atingido');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts} em ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  /**
   * Agenda reconexão
   */
  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnect();
    }
  }
  
  /**
   * Envia mensagem para o servidor
   */
  sendMessage(message) {
    if (!this.isConnected || !this.ws) {
      console.warn('⚠️ Servidor não conectado');
      return false;
    }
    
    try {
      this.ws.send(JSON.stringify(message));
      console.log('📤 Mensagem enviada:', message.type);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      return false;
    }
  }
  
  /**
   * Envia dados de página capturada (DESABILITADO para desktop)
   */
  sendPageData(pageData) {
    // DESABILITADO: Desktop app não precisa enviar dados automaticamente
    console.log('⏸️ Envio automático de dados de página desabilitado para desktop');
    return false;
    
    /*
    const message = {
      type: 'PAGE_CAPTURED',
      peerId: this.peerId,
      pageData: {
        url: pageData.url,
        host: pageData.host,
        title: pageData.title,
        content: pageData.content,
        metadata: pageData.metadata,
        timestamp: pageData.timestamp
      },
      timestamp: Date.now()
    };
    
    return this.sendMessage(message);
    */
  }
  
  /**
   * Gera ID único do peer
   */
  generatePeerId() {
    return `peer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Exporta para uso global
window.BuscaLogoAPIClient = BuscaLogoAPIClient;

console.log('🔌 Cliente do BuscaLogo carregado');
