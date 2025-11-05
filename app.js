// Math Bitcoin App - Logique principale
class MathBitcoinApp {
    constructor() {
        // Données initiales
        this.stats = {
            totalSatoshis: 1250,
            totalQuestions: 47,
            correctAnswers: 42,
            totalAdRevenue: 0.63,
            developerEarnings: 0.315,
            startTime: Date.now(),
            totalTime: 391000 // temps simulé pour les 47 questions
        };

        // Configuration
        this.config = {
            zbdGamertag: 'psychaospatf8095a04',
            zbdApiKey: '',
            adsenseId: '',
            zbdConfigured: true,
            adConfigured: false
        };

        // État du jeu
        this.currentQuestion = null;
        this.questionStartTime = null;
        this.questionTimer = null;

        // Messages d'encouragement
        this.encouragementMessages = [
            "Excellent calcul mental !",
            "Tu deviens un expert en mathématiques !",
            "Plus besoin de calculatrice pour toi !",
            "Fantastique ! Continue comme ça !",
            "Bravo ! Ton cerveau est plus rapide qu'une calculatrice !"
        ];

        // Récompenses par difficulté
        this.rewardRanges = {
            easy: { min: 10, max: 25 },
            medium: { min: 25, max: 50 },
            hard: { min: 50, max: 100 }
        };

        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.updateDisplay();
        this.updateStatusIndicators();
    }

    loadData() {
        const savedStats = localStorage.getItem('mathBitcoinStats');
        const savedConfig = localStorage.getItem('mathBitcoinConfig');

        if (savedStats) {
            this.stats = { ...this.stats, ...JSON.parse(savedStats) };
        }

        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }
    }

    saveData() {
        localStorage.setItem('mathBitcoinStats', JSON.stringify(this.stats));
        localStorage.setItem('mathBitcoinConfig', JSON.stringify(this.config));
    }

    bindEvents() {
        // Configuration ZBD
        document.getElementById('saveZbdConfig').addEventListener('click', () => this.saveZbdConfig());
        
        // Configuration AdSense
        document.getElementById('saveAdConfig').addEventListener('click', () => this.saveAdConfig());

        // Jeu
        document.getElementById('newQuestionBtn').addEventListener('click', () => this.generateNewQuestion());
        document.getElementById('verifyBtn').addEventListener('click', () => this.verifyAnswer());
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.verifyAnswer();
        });

        // Publicité
        document.getElementById('watchAdBtn').addEventListener('click', () => this.watchAd());

        // Actions
        document.getElementById('viewStatsBtn').addEventListener('click', () => this.showStatsModal());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetApp());

        // Modal
        document.getElementById('closeStatsModal').addEventListener('click', () => this.hideStatsModal());
        document.getElementById('statsModal').addEventListener('click', (e) => {
            if (e.target.id === 'statsModal') this.hideStatsModal();
        });
    }

    updateDisplay() {
        // Statistiques principales
        document.getElementById('totalSatoshis').textContent = this.stats.totalSatoshis;
        document.getElementById('totalQuestions').textContent = this.stats.totalQuestions;
        document.getElementById('adRevenue').textContent = `$${this.stats.totalAdRevenue.toFixed(2)}`;
        document.getElementById('developerEarnings').textContent = `$${this.stats.developerEarnings.toFixed(3)}`;

        // Calcul et affichage de la précision
        const accuracy = this.stats.totalQuestions > 0 
            ? Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100)
            : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        // Barre de progression
        document.getElementById('progressFill').style.width = `${accuracy}%`;

        // Configuration
        document.getElementById('zbdGamertag').value = this.config.zbdGamertag;
        if (this.config.zbdApiKey) {
            document.getElementById('zbdApiKey').value = this.config.zbdApiKey;
        }
        if (this.config.adsenseId) {
            document.getElementById('adsenseId').value = this.config.adsenseId;
        }
    }

    updateStatusIndicators() {
        // Statut ZBD
        const zbdStatus = document.getElementById('zbdStatus');
        const zbdDot = zbdStatus.querySelector('.status-dot');
        const zbdText = zbdStatus.querySelector('span');

        if (this.config.zbdConfigured && this.config.zbdGamertag) {
            zbdDot.className = 'status-dot status-dot--success';
            zbdText.textContent = 'Configuré';
        } else {
            zbdDot.className = 'status-dot status-dot--error';
            zbdText.textContent = 'Non configuré';
        }

        // Statut AdSense
        const adStatus = document.getElementById('adStatus');
        const adDot = adStatus.querySelector('.status-dot');
        const adText = adStatus.querySelector('span');

        if (this.config.adConfigured && this.config.adsenseId) {
            adDot.className = 'status-dot status-dot--success';
            adText.textContent = 'Configuré';
        } else {
            adDot.className = 'status-dot status-dot--error';
            adText.textContent = 'Non configuré';
        }
    }

    saveZbdConfig() {
        const gamertag = document.getElementById('zbdGamertag').value.trim();
        const apiKey = document.getElementById('zbdApiKey').value.trim();

        if (gamertag) {
            this.config.zbdGamertag = gamertag;
            this.config.zbdApiKey = apiKey;
            this.config.zbdConfigured = true;
            this.saveData();
            this.updateStatusIndicators();
            this.showToast('Configuration ZBD sauvegardée avec succès!', 'success');
        } else {
            this.showToast('Veuillez saisir un gamertag ZBD valide.', 'error');
        }
    }

    saveAdConfig() {
        const adsenseId = document.getElementById('adsenseId').value.trim();

        if (adsenseId && (adsenseId.startsWith('ca-pub-') || adsenseId.length > 5)) {
            this.config.adsenseId = adsenseId;
            this.config.adConfigured = true;
            this.saveData();
            this.updateStatusIndicators();
            this.showToast('Configuration AdSense sauvegardée avec succès!', 'success');
        } else {
            this.showToast('Veuillez saisir un ID AdSense valide.', 'error');
        }
    }

    generateNewQuestion() {
        const operations = ['addition', 'soustraction', 'multiplication'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer, difficulty, questionText;

        switch (operation) {
            case 'addition':
                difficulty = 'easy';
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                answer = num1 + num2;
                questionText = `Combien font ${num1} + ${num2} ?`;
                break;
            
            case 'soustraction':
                difficulty = 'easy';
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
                answer = num1 - num2;
                questionText = `Combien font ${num1} - ${num2} ?`;
                break;
            
            case 'multiplication':
                difficulty = 'medium';
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                questionText = `Combien font ${num1} × ${num2} ?`;
                break;
        }

        this.currentQuestion = {
            text: questionText,
            answer: answer,
            difficulty: difficulty,
            operation: operation
        };

        // Affichage de la question
        document.getElementById('questionDisplay').textContent = questionText;
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();

        // Affichage des conteneurs
        document.getElementById('questionContainer').classList.remove('hidden');
        document.getElementById('feedbackContainer').classList.add('hidden');
        document.getElementById('newQuestionBtn').textContent = '🔄 Question Suivante';

        // Démarrage du timer
        this.questionStartTime = Date.now();
        this.startQuestionTimer();
    }

    startQuestionTimer() {
        let seconds = 0;
        const timerElement = document.getElementById('questionTimer');

        this.questionTimer = setInterval(() => {
            seconds++;
            timerElement.textContent = `⏱️ ${seconds}s`;
        }, 1000);
    }

    stopQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    verifyAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        const timeSpent = Date.now() - this.questionStartTime;
        const timeInSeconds = Math.floor(timeSpent / 1000);

        this.stopQuestionTimer();

        if (isNaN(userAnswer)) {
            this.showToast('Veuillez saisir une réponse numérique.', 'error');
            return;
        }

        this.stats.totalQuestions++;
        this.stats.totalTime += timeSpent;

        const isCorrect = userAnswer === this.currentQuestion.answer;
        const feedbackContainer = document.getElementById('feedbackContainer');
        const feedbackMessage = document.getElementById('feedbackMessage');
        const rewardAnimation = document.getElementById('rewardAnimation');

        // Afficher le conteneur de feedback
        feedbackContainer.classList.remove('hidden');

        if (isCorrect) {
            this.stats.correctAnswers++;
            
            // Calcul des satoshis avec bonus de vitesse
            const baseReward = this.calculateReward(this.currentQuestion.difficulty);
            const speedBonus = this.calculateSpeedBonus(timeInSeconds);
            const totalSats = baseReward + speedBonus;
            
            this.stats.totalSatoshis += totalSats;

            // Message d'encouragement aléatoire
            const encouragement = this.encouragementMessages[
                Math.floor(Math.random() * this.encouragementMessages.length)
            ];

            feedbackMessage.textContent = `✅ CORRECT! ${encouragement}`;
            feedbackMessage.className = 'feedback-message feedback-message--success';
            rewardAnimation.textContent = `+${totalSats} sats ₿`;
            rewardAnimation.style.display = 'block';

            // Animation du reward
            rewardAnimation.style.animation = 'none';
            setTimeout(() => {
                rewardAnimation.style.animation = 'bounceIn 0.6s ease-out';
            }, 10);

            // Simulation de paiement ZBD
            this.simulateZbdPayment(totalSats);

            // Toast de succès
            setTimeout(() => {
                this.showToast(`Excellent! +${totalSats} satoshis gagnés!`, 'success');
            }, 500);

        } else {
            feedbackMessage.textContent = `❌ INCORRECT! La bonne réponse était ${this.currentQuestion.answer}.`;
            feedbackMessage.className = 'feedback-message feedback-message--error';
            rewardAnimation.style.display = 'none';

            this.showToast('Dommage! Essayez la prochaine question.', 'error');
        }

        this.updateDisplay();
        this.saveData();

        // Cacher le feedback après 4 secondes
        setTimeout(() => {
            feedbackContainer.classList.add('hidden');
        }, 4000);
    }

    calculateReward(difficulty) {
        const range = this.rewardRanges[difficulty];
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }

    calculateSpeedBonus(timeInSeconds) {
        if (timeInSeconds <= 3) return 15;
        if (timeInSeconds <= 5) return 10;
        if (timeInSeconds <= 8) return 5;
        return 0;
    }

    simulateZbdPayment(amount) {
        setTimeout(() => {
            this.showToast(`💸 Paiement ZBD: ${amount} sats → ${this.config.zbdGamertag}`, 'info');
        }, 1000);
    }

    watchAd() {
        this.showToast('📺 Chargement de la publicité...', 'info');
        
        // Désactiver le bouton pendant la publicité
        const adBtn = document.getElementById('watchAdBtn');
        adBtn.disabled = true;
        adBtn.textContent = '⏳ Chargement...';
        
        // Simulation de visionnage de publicité
        setTimeout(() => {
            const adReward = 50;
            const adRevenue = 0.05; // 5 centimes par pub
            const developerShare = adRevenue * 0.5;

            this.stats.totalSatoshis += adReward;
            this.stats.totalAdRevenue += adRevenue;
            this.stats.developerEarnings += developerShare;

            this.updateDisplay();
            this.saveData();

            // Réactiver le bouton
            adBtn.disabled = false;
            adBtn.textContent = '🎬 Regarder Pub (+50 sats)';

            this.showToast(`✅ Publicité terminée! +${adReward} sats gagnés!`, 'success');
        }, 3000);
    }

    showStatsModal() {
        const accuracy = this.stats.totalQuestions > 0 
            ? Math.round((this.stats.correctAnswers / this.stats.totalQuestions) * 100)
            : 0;
        const avgTime = this.stats.totalQuestions > 0
            ? Math.round(this.stats.totalTime / this.stats.totalQuestions / 1000 * 10) / 10
            : 0;
        const incorrectAnswers = this.stats.totalQuestions - this.stats.correctAnswers;

        document.getElementById('modalTotalQuestions').textContent = this.stats.totalQuestions;
        document.getElementById('modalCorrectAnswers').textContent = this.stats.correctAnswers;
        document.getElementById('modalIncorrectAnswers').textContent = incorrectAnswers;
        document.getElementById('modalSuccessRate').textContent = `${accuracy}%`;
        document.getElementById('modalAvgTime').textContent = `${avgTime}s`;
        document.getElementById('modalTotalSats').textContent = `${this.stats.totalSatoshis} ₿`;

        document.getElementById('statsModal').classList.remove('hidden');
    }

    hideStatsModal() {
        document.getElementById('statsModal').classList.add('hidden');
    }

    resetApp() {
        if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques?\n\nCette action supprimera:\n• Tous vos satoshis gagnés\n• Toutes vos statistiques\n• Votre progression\n\nCette action est IRRÉVERSIBLE!')) {
            this.stats = {
                totalSatoshis: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                totalAdRevenue: 0,
                developerEarnings: 0,
                startTime: Date.now(),
                totalTime: 0
            };

            // Garder les configurations mais les marquer comme non configurées pour forcer une re-validation
            this.config.zbdConfigured = false;
            this.config.adConfigured = false;

            this.saveData();
            this.updateDisplay();
            this.updateStatusIndicators();

            // Réinitialiser l'interface
            document.getElementById('questionContainer').classList.add('hidden');
            document.getElementById('feedbackContainer').classList.add('hidden');
            document.getElementById('newQuestionBtn').textContent = '🎯 Nouvelle Question';
            this.hideStatsModal();

            this.showToast('🔄 Application réinitialisée avec succès!', 'info');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Supprimer le toast après 4 secondes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4000);
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.mathBitcoinApp = new MathBitcoinApp();
    console.log('🪙 Math Bitcoin App initialisée avec succès!');
});