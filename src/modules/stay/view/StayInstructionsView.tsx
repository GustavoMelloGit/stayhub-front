import { type FC } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  CarFront,
  DoorClosed,
  MapPin,
  PawPrint,
  Users,
  Wrench,
} from 'lucide-react';
import { useGetPublicStay } from '../service/StayService.hooks';
import { useParams } from 'react-router-dom';

const dateFormatter = Intl.DateTimeFormat('pt-BR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

export const StayInstructionsView: FC = () => {
  const { stay_id } = useParams<{ stay_id: string }>();
  const { data: stay, isPending } = useGetPublicStay(stay_id || '');

  if (!stay || isPending) return <div>Carregando...</div>;

  const checkInDate = dateFormatter.format(stay.check_in);
  const checkOutDate = dateFormatter.format(stay.check_out);

  return (
    <div className='bg-[#fbf4ed] text-neutral-800'>
      <div className='max-w-[40rem] mx-auto space-y-4 leading-none'>
        <img
          src='/stay-image.jpeg'
          alt='apartamento 201 - Praia dos Castelhanos'
          className='sm:rounded-2xl'
          width={764}
          height={429}
          loading='eager'
        />
        <div className='px-4 pb-10 space-y-4'>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold'>Olá, {stay.tenant.name}</h1>
            <h2 className='leading-tight'>
              Que bom ter você com a gente! Para tornar sua estadia ainda mais
              tranquila, reunimos aqui algumas informações importantes:
            </h2>
          </div>

          <div className='space-y-3 [&>section]:space-y-2 [&_h3]:font-semibold'>
            <section>
              <h3>COMO CHEGAR</h3>
              <div className='flex gap-2'>
                <MapPin size={20} className='min-w-5' />
                <div className='space-y-1'>
                  <h4 className='font-semibold'>Endereço</h4>
                  <p>
                    Rua Salma Souki Oliveira, S/N, Praia dos Castelhanos.
                    <br />
                    Ed. Bandeira Azul, Ap. 201
                  </p>
                </div>
              </div>
              <a
                href='https://maps.app.goo.gl/S5G5VZWHwgY7jZtR8'
                target='_blank'
                referrerPolicy='no-referrer'
                className='w-full ring ring-neutral-800 rounded-sm p-2 flex items-center gap-2 justify-center'
              >
                <MapPin size={20} className='size-5' />
                Abrir no Google Maps
              </a>
            </section>
            <Separator />
            <section>
              <h3>CHECK-IN & CHECK-OUT</h3>

              <div className='grid grid-cols-2 ring ring-neutral-300 border-neutral-300 rounded-lg [&>div]:p-2 [&>div]:space-y-0.5 [&_.value]:font-light [&_.label]:font-medium'>
                <div className='border-b border-r border-inherit'>
                  <p className='label'>Após</p>
                  <span className='value'>{checkInDate}</span>
                </div>
                <div className='border-b border-inherit'>
                  <p className='label'>Até</p>
                  <span className='value'>{checkOutDate}</span>
                </div>
                <div className='border-r border-inherit'>
                  <p className='label'>Co-anfitrião</p>
                  <a className='underline value' href='tel:+5528999849054'>
                    +55 28 99984-9054
                  </a>
                </div>
                <div>
                  <p className='label'>Senha</p>
                  <span className='value'>{stay.entrance_code}</span>
                </div>
              </div>
              <p>
                O co-anfitrião acompanhará seu check-in e check-out. Por isso,{' '}
                <strong>
                  avise o horário da sua chegada com antecedência.
                </strong>
              </p>
              <p>
                Sua senha da fechadura eletrônica é:{' '}
                <strong>{stay.entrance_code}</strong>. <br />
                Ela é exclusiva da sua estadia e será desativada automaticamente
                logo após o check-out.
              </p>
            </section>
            <Separator />
            <section>
              <h3>WIFI</h3>
              <div className='grid grid-cols-2 ring ring-neutral-300 border-neutral-300 rounded-lg [&>div]:p-2 [&>div]:space-y-0.5 [&_.value]:font-light [&_.label]:font-medium'>
                <div className='border-r border-inherit'>
                  <p className='label'>Nome</p>
                  <span className='value'>WIFI_BANDEIRA</span>
                </div>
                <div>
                  <p className='label'>Senha</p>
                  <span className='value'>wmag2907</span>
                </div>
              </div>
            </section>
            <Separator />
            <section>
              <h3>REGRAS DA CASA</h3>
              <ul className='[&>li]:flex [&>li]:gap-1  [&_svg]:min-w-5 space-y-2'>
                <li>
                  <CarFront size={20} /> <span>Use apenas a vaga 201.</span>
                </li>
                <li>
                  <PawPrint size={20} />{' '}
                  <span>Pets só com autorização prévia do anfitrião.</span>
                </li>
                <li>
                  <Users size={20} />{' '}
                  <span>
                    Apenas os hóspedes combinados devem permanecer no imóvel.
                  </span>
                </li>
                <li>
                  <DoorClosed size={20} />{' '}
                  <span>Mantenha as portas do condomínio sempre fechadas.</span>
                </li>
                <li>
                  <Wrench size={20} />{' '}
                  <span>
                    Se algo estiver quebrado ou apresentar problemas, informe
                    imediatamente.
                  </span>
                </li>
              </ul>
            </section>
            <Separator />
            <section>
              <h3>FECHADURA ELETRÔNICA</h3>
              <div className='space-y-2'>
                <ul className='space-y-2'>
                  <li>
                    <b>Digite a senha:</b> toque na parte superior da fechadura
                    até os números acenderem. Em seguida, insira sua senha e
                    aperte &quot;#&quot;.
                  </li>
                  <li>
                    <b>Evite problemas:</b> mantenha o pequeno
                    &quot;interruptor&quot; abaixo da maçaneta (lado de dentro)
                    sempre na posição para baixo.
                  </li>
                  <li>
                    <iframe
                      className='w-full aspect-video'
                      src='https://www.youtube.com/embed/Y8eaU1zkkB8'
                      title='Tuya APP WIFI Fechadura Digital de Sobrepor, Fechadura Eletronica Fechaduras Digital de Embutir'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      referrerPolicy='strict-origin-when-cross-origin'
                      allowFullScreen
                    ></iframe>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
