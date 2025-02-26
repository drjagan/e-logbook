Here's the complete rewritten code with the updated `departments` array:

```tsx
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slices/authSlice';

const departments = [
  'Anatomy (M.D.)',
  'Anaesthesiology (M.D.)',
  'Biochemistry (M.D.)',
  'Community Medicine (M.D.)',
  'Dermatology, Venereology and Leprosy (M.D.)',
  'Emergency Medicine (M.D.)',
  'Family Medicine (M.D.)',
  'Forensic Medicine and Toxicology (M.D.)',
  'General Medicine (M.D.)',
  'Microbiology (M.D.)',
  'Pediatrics (M.D.)',
  'Pathology (M.D.)',
  'Pharmacology (M.D.)', 
  'Physiology (M.D.)',
  'Psychiatry (M.D.)',
  'Radio-diagnosis (M.D.)',
  'Respiratory Medicine (M.D.)',
  'General Surgery (M.S.)',
  'Obstetrics and Gynecology (M.S.)',
  'Ophthalmology (M.S.)',
  'Orthopaedics (M.S.)',
  'Otorhinolaryngology (M.S.)'
];

[rest of the code remains exactly the same...]
