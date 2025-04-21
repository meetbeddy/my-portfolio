import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

const InterestCard = styled(motion.div)`
  background: ${props => props.bgColor || props.theme.colors.surface};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.animation.durations.medium} ${props => props.theme.animation.easings.easeInOut};
  
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const InterestTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
`;

const MusicInterestCard = ({ bgColor }) => {
    // Spotify playlist ID - replace with your actual playlist ID
    const spotifyPlaylistId = "37i9dQZF1DX5trt9i14X7j"; // Example playlist ID (coding focus playlist)

    return (
        <InterestCard bgColor={bgColor}>
            <InterestTitle>
                <Headphones style={{
                    marginRight: '0.5rem',
                    color: '#4a9fff'
                }} size={20} /> Music
            </InterestTitle>
            <p>Indie-pop is my coding soundtrack. Nothing beats finding the perfect song to match the problem I'm solving.</p>

            {/* Spotify Playlist Embed */}
            <div style={{ marginTop: '1rem' }}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginTop: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        position: 'relative'
                    }}
                >
                    {/* Real Spotify iframe */}
                    <div style={{
                        width: '100%',
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        height: 0,
                        overflow: 'hidden',
                        maxWidth: '100%'
                    }}>
                        <iframe
                            title="Spotify Playlist"
                            src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                            frameBorder="0"
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    </div>

                </motion.div>

                <div style={{
                    fontSize: '0.8rem',
                    opacity: 0.8,
                    marginTop: '12px',
                    textAlign: 'center'
                }}>
                    Currently featuring indie gems from Japanese Breakfast, The Marias, and Men I Trust
                </div>
            </div>
        </InterestCard>
    );
};

export default MusicInterestCard;