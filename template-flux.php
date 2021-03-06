<?php
/*
Template Name: Flux
*/
?>

<?php

$getallposts = new WP_Query( array(
    'post_type'      => 'post', // set the post type to page
)); ?>


<nav id="timeline">
	<div id="scrollZone">
	</div>
	<div class="container">

	<?php

	/* 	$lastpost = $getallposts[$counter]; */
	/* 	$lastpost_date = $lastpost->post_date; */
	/* 	$output = date($format, strtotime( $lastpost_date )); */

		$args = array(
		    'post_type'      => 'post',
		    'order' => 'ASC'
		 );

		$last = wp_get_recent_posts( $args );
		$last_id = $last['0']['ID'];
		$oldestpostUnix = ( current_time( 'timestamp', 0 ) - get_post_time('U', false, $last_id ) ) / 60;

		while ($getallposts->have_posts()) : $getallposts->the_post() ?>
				<?php
				$minpassed = ( current_time( 'timestamp', 0 ) - get_post_time('U', false) ) / 60;
				//$auteurpos = ( (get_the_author_meta('ID')-1) / count(get_users()) ) * 100;

				$minpassedpercent = ( $minpassed / $oldestpostUnix ) ;

				?>
				<div data-post="<?php the_ID(); ?>" class="element" <?php post_class(); ?> data-ancienetepercent="<?php echo $minpassedpercent ?>" data-auteur="<?php echo get_the_author_meta('ID')?>" data-minutesecoulees="<?php echo $minpassed ?>" data-title="<?php the_title(); ?>">
					<div class="content">
					</div>
				</div>
		<?php endwhile; ?>
	</div>
</nav>


<div id="cropwindow">
	<div id="cropcontent">
		<?php

			global $wp_query;
			$wp_query->in_the_loop = true;

			while ($getallposts->have_posts()) : $getallposts->the_post() ?>
			<article data-post="<?php the_ID(); ?>" <?php post_class(); ?> style="">
					<div class="content fee-group">
						<div class="fee-buttons"></div>
						<header class="name">
							<div data-auteur="<?php echo get_the_author_meta('ID')?>" class="meta">
								<auteur><?php echo get_the_author(); ?></auteur>
								<time class="published" datetime="<?php echo get_the_time('c'); ?>"><?php echo get_the_date(); ?></time>
							</div>
							<a title="Permanent Link to <?php the_title_attribute(); ?>" href="<?php the_permalink() ?>"><h2><?php the_title(); ?></h2></a>

						</header>
						<div class="entry-summary description">
							<?php the_content(); ?>
						</div>
					</div>
			</article>

		<?php endwhile; ?>
	</div>
</div>

<div id="attachmentCol">



</div>

<?php if ($wp_query->max_num_pages > 1) : ?>
  <nav class="post-nav">
    <ul class="pager">
      <li class="previous"><?php next_posts_link(__('&larr; Older posts', 'roots')); ?></li>
      <li class="next"><?php previous_posts_link(__('Newer posts &rarr;', 'roots')); ?></li>
    </ul>
  </nav>
<?php endif; ?>

