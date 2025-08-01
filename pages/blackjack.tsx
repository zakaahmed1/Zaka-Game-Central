// pages/blackjack.tsx
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Card, calculateScore, shuffleDeck, playSound } from '../utils/blackjackLogic';
import Link from 'next/link';
import styles from '../styles/Blackjack.module.css';

const Blackjack = () => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState('');
    const [dealing, setDealing] = useState(false);
    const [showHoleCard, setShowHoleCard] = useState(false);
    const [hideDealerCard, setHideDealerCard] = useState(true); // ✅ ADDED

    const dealSfx = useRef<HTMLAudioElement | null>(null);
    const winSfx = useRef<HTMLAudioElement | null>(null);
    const loseSfx = useRef<HTMLAudioElement | null>(null);
    const shuffleSfx = useRef<HTMLAudioElement | null>(null);

    const createDeck = (): Card[] => {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        return suits.flatMap(suit => values.map(value => ({ suit, value })));
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const dealInitialCards = async (newDeck: Card[]) => {
        setDealing(true);
        const newPlayer: Card[] = [];
        const newDealer: Card[] = [];

        for (let i = 0; i < 2; i++) {
            newPlayer.push(newDeck[i * 2]);
            setPlayerHand([...newPlayer]);
            playSound(dealSfx.current!);
            await delay(400);

            newDealer.push(newDeck[i * 2 + 1]);
            setDealerHand([...newDealer]);
            playSound(dealSfx.current!);
            await delay(400);
        }

        setDeck(newDeck.slice(4));
        setDealing(false);
    };

    const startGame = async () => {
        const newDeck = shuffleDeck(createDeck());
        setGameOver(false);
        setMessage('');
        setPlayerHand([]);
        setDealerHand([]);
        setShowHoleCard(false);
        setHideDealerCard(true); // ✅ hide on start
        setDeck(newDeck);
        playSound(shuffleSfx.current!);
        await dealInitialCards(newDeck);
    };

    const hit = () => {
        if (gameOver || deck.length === 0) return;
        const card = deck[0];
        const newDeck = deck.slice(1);
        const newHand = [...playerHand, card];
        setDeck(newDeck);
        setPlayerHand(newHand);
        playSound(dealSfx.current!);

        const score = calculateScore(newHand);
        if (score > 21) {
            setMessage('You busted!');
            playSound(loseSfx.current!);
            setGameOver(true);
            setShowHoleCard(true);
            setHideDealerCard(false); // ✅ reveal dealer’s card if busted
        }
    };

    const stand = async () => {
        setShowHoleCard(true);
        setHideDealerCard(false); // ✅ reveal dealer hole card
        let newDealer = [...dealerHand];
        let dealerScore = calculateScore(newDealer);
        const playerScore = calculateScore(playerHand);

        while (dealerScore < 17) {
            await delay(600);
            const card = deck.shift()!;
            newDealer.push(card);
            setDealerHand([...newDealer]);
            dealerScore = calculateScore(newDealer);
            playSound(dealSfx.current!);
        }

        if (dealerScore > 21 || playerScore > dealerScore) {
            setMessage('You win!');
            playSound(winSfx.current!);
        } else if (playerScore < dealerScore) {
            setMessage('Dealer wins.');
            playSound(loseSfx.current!);
        } else {
            setMessage("It's a tie.");
        }

        setGameOver(true);
    };

    useEffect(() => {
        startGame();
    }, []);

    const renderCard = (card: Card, index: number, hide?: boolean) => {
        if (hide) {
            return (
                <Image
                    key={index}
                    src="/cards/back.png"
                    alt="Hidden Card"
                    width={80}
                    height={120}
                    className={styles.card}
                />
            );
        }

        return (
            <Image
                key={index}
                src={`/cards/${card.value}_of_${card.suit}.png`}
                alt={`${card.value} of ${card.suit}`}
                width={80}
                height={120}
                className={styles.card}
            />
        );
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Blackjack</h1>
            <h2 className={styles.subheading}>Dealer's Hand</h2>
            <div className={styles.cardRow}>
                {dealerHand.map((card, index) =>
                    renderCard(card, index, index === 0 && hideDealerCard)
                )}
            </div>
            <h2 className={styles.subheading}>Your Hand</h2>
            <div className={styles.cardRow}>
                {playerHand.map((card, index) => renderCard(card, index, false))}
            </div>
            <p className={styles.message}>{message}</p>
            <div className={styles.controls}>
                {!gameOver && !dealing && (
                    <>
                        <button className={styles.button} onClick={hit}>Hit</button>
                        <button className={styles.button} onClick={stand}>Stand</button>
                    </>
                )}
                <button className={styles.button} onClick={startGame}>New Game</button>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <Link href="/" legacyBehavior>
                    <a className={styles.backButton}>← Back</a>
                </Link>
            </div>
            <audio ref={dealSfx} src="/audio/deal.mp3" preload="auto" />
            <audio ref={winSfx} src="/audio/win.mp3" preload="auto" />
            <audio ref={loseSfx} src="/audio/lose.mp3" preload="auto" />
            <audio ref={shuffleSfx} src="/audio/shuffle.mp3" preload="auto" />
        </div>
    );
};

export default Blackjack;
